#!/usr/bin/env bash

ORIG_DIR=$(pwd)
API_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd ${API_DIR}/prisma
prisma deploy -e .env.dev
prisma deploy -e .env.test
cd ${ORIG_DIR}