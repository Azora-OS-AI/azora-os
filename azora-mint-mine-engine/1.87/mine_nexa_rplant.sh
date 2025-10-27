#!/bin/bash

POOL=stratum-eu.rplant.xyz:17092
WALLET=nexa:nqtsq5g5galktrng3lfa3u9p7yv9d0dzzkv400vgaz23m77e

./lolMiner --algo NEXA --pool $POOL --user $WALLET $@

