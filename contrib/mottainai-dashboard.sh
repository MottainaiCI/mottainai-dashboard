#!/bin/bash
# Author: Daniele Rondina, geaaru@sabayonlinux.org
# Description: Nodejs wrapper for Mottainai Dashboard


NPM_PACKAGENAME=mottainai-dashboard
LIBDIR=${LIBDIR:-lib64}
EROOT=${EROOT:-/}
binfile=proxy.js

def_node_path="${EROOT}usr/${LIBDIR}/node_modules/"
app_node_path="${EROOT}usr/${LIBDIR}/node_modules/${NPM_PACKAGENAME}/node_modules/"

export NODE_PATH=${app_node_path}:${def_node_path}

node ${EROOT}usr/${LIBDIR}/node_modules/${NPM_PACKAGENAME}/bin/proxy.js \$@
