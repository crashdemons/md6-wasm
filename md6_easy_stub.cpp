#include "md6_easy_stub.hpp"


md6_state* md6_init_easy(int d){
	md6_state* ctx = malloc(sizeof(md6_state));
	md6_init(ctx, d);
}

void md6_cleanup_easy(md6_state* ctx){
	free(ctx);
}
