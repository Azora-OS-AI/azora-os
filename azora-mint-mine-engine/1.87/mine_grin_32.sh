#!/bin/bash

#################################
## Begin of user-editable part ##
#################################

POOL=asia-grin.2miners.com:3030
WALLET=grin13s68p9tfzn2yugjw0hzh33x694k6f88ksl6py4nuefuwwc9gzfdsn9gj7v.WorkerName
PASS=x

#################################
##  End of user-editable part  ##
#################################

cd "$(dirname "$0")"

./lolMiner -a C32 --pool $POOL --user $WALLET --pass $PASS $@
