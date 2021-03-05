rm -rf md6-wasm-dist
mkdir md6-wasm-dist

#W_FLAGS="-O3 -flto -DNDEBUG"
W_FLAGS="-O0 -g -v -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 --memoryprofiler"
echo $W_FLAGS
emcc $W_FLAGS -s MODULARIZE=1 -s 'EXPORT_NAME="createMd6Module"' -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' md6_mode.cpp md6_easy_stub.cpp -o md6-wasm-dist/md6-wasm.js


cat md6-wasm-dist/md6-wasm.js js-wrapper/wrapper.js > md6-wasm-dist/md6-wrapped.js



