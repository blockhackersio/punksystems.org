#!/usr/bin/env bash
set -euo pipefail

if [ -z "${SIGNAL_LINK:-}" ]; then
  echo "ERROR: SIGNAL_LINK environment variable is not set"
  echo "Usage: SIGNAL_LINK='https://signal.me/#eu/...' ./build.sh"
  exit 1
fi

sed -i.bak "s|https://signal.me/#example|$SIGNAL_LINK|g" config.toml
zola build
mv config.toml.bak config.toml
