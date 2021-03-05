#include <iostream>
#include <cstring>
#include "md6_easy_stub.hpp"

char _nibble2hex(unsigned char nibble) {
  if (nibble < 10)
    return '0' + nibble;
  else
    return 'a' + nibble - 10;
}


void _hexDigest(unsigned char* digest, char* hexdigest, int byteLen){
   for(unsigned int i = 0,h=0; i < byteLen; i++){
        int hi = (digest[i]&0xF0) >> 4;
        int lo = digest[i]&0x0F;
        hexdigest[h++]=_nibble2hex(hi);
        hexdigest[h++]=_nibble2hex(lo);
//        std::cout<<"[main] "<<_nibble2hex(hi)<<_nibble2hex(lo)<<std::endl;
   }
}


void test(const char* inputS, int hashBitLen){
	int hashByteLen = hashBitLen/8;
	const unsigned char* input = (unsigned char*) inputS;

	md6_state* ctx = md6_init_easy(hashBitLen);

	md6_update(ctx, input, strlen(inputS)*8);

	unsigned char* output2 = (unsigned char*) malloc(hashByteLen);
	md6_final(ctx,output2);
	char* output2h = (char*) malloc(hashByteLen*2 + 1);
	output2h[hashByteLen*2]=0;
	_hexDigest(output2,output2h,hashByteLen);
	std::cout<<"md6-"<<hashBitLen<<" test output raw: "<<output2h<<std::endl;




//	fnv0(input, strlen(input), output);
//	printf("output %s",output);

	free(output2);
	free(output2h);
	md6_cleanup_easy(ctx);

}


int main(){
	test("test",128);
	test("test",256);
	test("test",512);
	return 0;

}
