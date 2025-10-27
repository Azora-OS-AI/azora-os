#!/bin/bash

POOL=tls://pool.woolypooly.com:3124
WALLET=nexa:nqtsq5g5galktrng3lfa3u9p7yv9d0dzzkv400vgaz23m77e

./lolMiner --algo NEXA --pool $POOL --user $WALLET $@

