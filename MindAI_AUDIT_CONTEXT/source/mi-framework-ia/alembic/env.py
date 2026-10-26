"""Migrations environment configuration.

This file is placed in the Alembic directory and is used to configure
the migration environment.
"""

import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Add model's MetaData object here for 'autogenerate support'
# 'target_metadata' is the SQLAlchemy MetaData object for which migrations will be generated.
# Import all models to ensure they are registered with Base.metadata
import pathlib

# Add the project root to the path so we can import models
project_root = pathlib.Path(__file__).parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

# Import all models so their metadata is registered
from models import __all__ as model_names  # noqa: F401

from core.base import Base

target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# config.get_section("alembic")