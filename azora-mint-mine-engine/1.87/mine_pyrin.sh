#!/bin/bash

POOL=pyrin.e4pool.com:12100
WALLET=pyrin:qq92h3nryfwq0gkh73cwvjh9hhqlq2mank9sfxtgc99hqwn2ec6u2gszphr0u

./lolMiner --algo PYRIN --pool $POOL --user $WALLET $@

