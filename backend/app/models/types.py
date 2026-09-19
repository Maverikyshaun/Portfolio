from enum import Enum as PyEnum

from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import mapped_column


def enum_column(enum_cls: type[PyEnum], *, length: int = 40, nullable: bool = False):
    return mapped_column(
        SqlEnum(
            enum_cls,
            native_enum=False,
            length=length,
            values_callable=lambda members: [item.value for item in members],
        ),
        nullable=nullable,
    )
