#!/bin/bash
set -e

# Execute o docker-entrypoint.sh
/usr/local/bin/docker-entrypoint.sh "$@"

# Execute o script database.sh
# /shapes/database.sh
