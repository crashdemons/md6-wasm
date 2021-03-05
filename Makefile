CXX=clang++
CFLAGS=-I. -g -O0 -Wall
#CFLAGS=-I. -O3 -Wall -lstdc++ -DNDEBUG

#all: test

#test: md6_mode.o
#	$(CXX) $(CFLAGS) -o test md6_compress.o md6_mode.o main.cpp
#
test: main.cpp md6_easy.o
	$(CXX) $(CFLAGS) -o test md6_mode.o md6_easy.o main.cpp

md6_easy.o: md6_easy_stub.hpp md6_easy_stub.cpp md6_mode.o
	$(CXX) $(CFLAGS) -o md6_easy.o md6_easy_stub.cpp -c

md6_mode.o: md6_mode.cpp md6.hpp
	$(CXX) $(CFLAGS) md6_mode.cpp -c



#uint512_llvm.o: uint512_llvm.hpp uint512_llvm.cpp
#	$(CXX) $(CFLAGS) uint512_llvm.cpp -c

.PHONY: clean

clean:
	rm -f ./*.o
	rm -f test


