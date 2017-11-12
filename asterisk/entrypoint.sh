#!/bin/bash

cleanup() {
    discovery del
}

trap 'cleanup' SIGTERM

"${@}" &

sleep 5
discovery ping &

wait $!