#!/usr/bin/env bash
# Runs ON THE SERVER, from the app directory (copied there by the pipeline).
#
#   IMAGE=ghcr.io/owner/lacon-frontend:production GHCR_USER=.. GHCR_TOKEN=.. \
#     bash deploy.sh docker-compose.prod.yml
#
# Pulls the image, restarts the container and fails (non-zero) unless the site
# answers afterwards, so a broken release turns the pipeline red.
set -euo pipefail

compose_file="${1:?usage: deploy.sh <compose-file>}"
: "${IMAGE:?IMAGE is required}"

[ -f "$compose_file" ] || { echo "missing $compose_file"; exit 1; }
[ -f .env ] || { echo "missing .env in $(pwd)"; exit 1; }

# Read one value from .env without sourcing it.
env_value() { grep -E "^$1[[:space:]]*=" .env | head -1 | cut -d= -f2- | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"//' -e 's/"$//'; }

missing=""
for key in HOST_WEB_PORT SECRET_KEY ALGORITHM NEXT_BASE_URL; do
  [ -n "$(env_value "$key")" ] || missing="$missing $key"
done
if [ -n "$missing" ]; then
  echo "Missing in .env:$missing"; exit 1
fi
[ -n "$(env_value CASE_API_KEY)" ] || echo "WARNING: CASE_API_KEY is not set in .env; public case filing will fail"

echo "== Logging in to the registry =="
if [ -n "${GHCR_TOKEN:-}" ]; then
  echo "$GHCR_TOKEN" | docker login ghcr.io -u "${GHCR_USER:-github}" --password-stdin
fi

echo "== Pulling $IMAGE =="
docker compose -f "$compose_file" pull

echo "== Restarting =="
docker compose -f "$compose_file" up -d --remove-orphans

echo "== Waiting for the site to answer =="
# No -L: a redirect to /login counts as up; only 4xx/5xx or no answer fails.
url="http://127.0.0.1:$(env_value HOST_WEB_PORT)/"
for i in $(seq 1 45); do
  if curl -fsS -o /dev/null "$url" 2>/dev/null; then
    echo "Up after ~$((i * 2))s: $url"
    docker image prune -f >/dev/null
    exit 0
  fi
  sleep 2
done

echo "Site did not answer at $url within 90s. Recent logs:" >&2
docker compose -f "$compose_file" ps >&2 || true
docker compose -f "$compose_file" logs --tail=80 web >&2 || true
exit 1
