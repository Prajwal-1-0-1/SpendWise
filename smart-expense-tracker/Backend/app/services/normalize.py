import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import Expense
from app.services.gemini_service import model

logger = logging.getLogger(__name__)


def _get_recent_distinct_values(db: Session, user_id: int, column) -> list[str]:
    cutoff = datetime.utcnow().date() - timedelta(days=365)
    rows = (
        db.query(column)
        .filter(
            Expense.user_id == user_id,
            Expense.purchase_date >= cutoff,
            column.isnot(None),
            column != "",
        )
        .distinct()
        .all()
    )
    return [row[0] for row in rows]


def _build_prompt(extracted_value: str, existing_values: list[str], field_name: str) -> str:
    values_list = "\n".join(f"- {v}" for v in existing_values)
    return (
        f"You are matching {field_name}s.\n\n"
        f"Extracted {field_name}:\n{extracted_value}\n\n"
        f"Existing {field_name}s:\n{values_list}\n\n"
        f"Rules:\n\n"
        f"1. If the extracted {field_name} clearly refers to one existing {field_name},\n"
        f"return EXACTLY that {field_name}.\n\n"
        f"2. Otherwise return EXACTLY:\n\n"
        f"NEW\n\n"
        f"Return only one line.\n"
        f"Do not explain.\n"
        f"Do not invent new {field_name}s.\n"
        f"Only choose from the supplied list."
    )


def normalize_value(
    extracted_value: str,
    existing_values: list[str],
    field_name: str,
) -> str:
    if not extracted_value or not existing_values:
        return extracted_value

    prompt = _build_prompt(extracted_value, existing_values, field_name)

    try:
        response = model.generate_content(prompt)
        result = response.text.strip()

        if result == "NEW":
            return extracted_value

        if result in existing_values:
            return result

        logger.warning(
            "Gemini returned unexpected %s '%s' for extracted '%s'. Falling back.",
            field_name, result, extracted_value,
        )
        return extracted_value

    except Exception:
        logger.exception(
            "%s normalization failed for '%s'. Falling back.",
            field_name.capitalize(), extracted_value,
        )
        return extracted_value


def normalize_merchant(db: Session, extracted_merchant: str, user_id: int) -> str:
    existing = _get_recent_distinct_values(db, user_id, Expense.merchant)
    return normalize_value(extracted_merchant, existing, "merchant")


def normalize_category(db: Session, extracted_category: str, user_id: int) -> str:
    existing = _get_recent_distinct_values(db, user_id, Expense.category)
    return normalize_value(extracted_category, existing, "category")
