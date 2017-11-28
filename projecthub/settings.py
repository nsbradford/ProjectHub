"""
    settings.py

    Use django-split-settings to include the production settings by default, 
        and optional local dev settings.
"""

from split_settings.tools import optional, include

include(
    'components/settings_production.py',
    optional('components/settings_dev.py')
)