#!/usr/bin/env bash

source "$(dirname "$0")/.env"

commit_and_push() {
  cd "$(dirname "$0")/.." || exit 2

  message='regular update'

  if (($# > 0)); then
    message=$1
  fi

  git add $TARGET_COPY_DIR
  git commit -a -m "$message"
  git push

}

copy() {
  while IFS= read -r line; do
    mkdir -p "$TARGET_COPY_DIR/$(dirname "$line")"
    cp -R "$SCRIPT_SOURCE_DIR/$line" "$TARGET_COPY_DIR/$line"
  done <"$SCRIPT_LIST"
}

copy
commit_and_push "$@"
