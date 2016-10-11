#!/bin/sh
kill -9 `lsof -i :3000 |grep node|awk '!a[$2]++ {print $2}'`
kill -9 `lsof -i :35729 |grep node|awk '!a[$2]++ {print $2}'`
