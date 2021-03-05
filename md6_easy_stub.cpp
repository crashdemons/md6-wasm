#include "md6_easy_stub.hpp"


md6_state* md6_init_easy(int d){
	md6_state* ctx = (md6_state*) malloc(sizeof(md6_state));
	md6_init(ctx, d);
	return ctx;
}

void md6_cleanup_easy(md6_state* ctx){
	free(ctx);
}
