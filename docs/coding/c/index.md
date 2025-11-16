# C语言复习

## main函数入口
可以通过main函数获取参数个数，参数列表，以及环境变量
``` c++
int main()
int main(int argc, char* argv[])
int main(int argc, char* argv[], char* env[]) //非标准
```

- argc在不传参的情况下为1 （这个可执行文件本身的名称）
- argv和env是指针数组，以argv[argc] == NULL 和env[envc] == NULL作为结束哨兵，但一般还是通过argc来for循环遍历argv.
- env作第三个形参的写法并非C/C++标准，但有时也可以用。
    - POSIX（Linux等）:
    ``` c++
    #include <unistd.h> //通常unistd.h中会声明environ，若声明，不用写下一句，但写了也没事因为重复声明是允许的
    extern char **environ
    ```

- VS中配置命令参数：解决方案管理器选项卡-解决方案上右键菜单-属性-调试-命令参数

## signed/unsigned char
char其实可以用来处理单字节整型, 例如使用GCC/G++编译器, 下面的两段代码都输出```-1```
``` c
#include<stdio.h>
using namespace std;
int main() {
    char c = -1;
    printf("%d\n", c);
    return 0;
}
```
``` c++
#include <iostream>
using namespace std;
int main()
{
    char c = -1;
    cout << (int)c << endl;
    return 0;
}
```

因此char也有signed和unsigned, x86平台大多默认signed char, 嵌入式平台例如arm大多是unsigned char. 显式使用signed/unsigned char才能确保可移植性。

若对unsigned char赋值为-1，补码转换使其解释为255
``` c
unsigned char uc = -1;
printf("unsigned char: %d\n", uc); //输出255
```

例如，下方c++代码是将字符串转换为Base16编码，其中的for循环中一定要使用unsigned char，否则会导致字符串下标越界
``` c++
static const string base16_enc_tab("012345678ABCDEF");

string testStr = "测试用于base16的字符串";
    string base16str;
    for (unsigned char c : testStr) {// (1)!
        char high = c >> 4;
        char low = c & 0b00001111;
        base16str += base16_enc_tab[high];
        base16str += base16_enc_tab[low];
    }
    cout << "Origin:\t" << testStr << endl;
    cout << "Base16:\t" << base16str << endl;
```

1. 
    若for循环中使用char, 由于```c```被解释为了signed char, ```>>```被解释为算术右移(保留符号位), 因此变量```high```在作为下标使用时被转换为unsigned的size_t类型, 从而变成一个巨大的正数, 导致下标越界.

## 算术右移/逻辑右移
逻辑右移:右移所有bit; 算术右移:符号位不动, 右移其它bit
- 对无符号数是逻辑右移
- 对有符号正数, 逻辑右移和算术右移相同
- 对有符号负数, 由编译器决定实现, 但一般为算术右移
