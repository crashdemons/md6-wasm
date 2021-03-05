#ifdef __EMSCRIPTEN__
#include "emscripten.h"
#define MD6_EXTERN EMSCRIPTEN_KEEPALIVE
#else
#define MD6_EXTERN extern
#endif
