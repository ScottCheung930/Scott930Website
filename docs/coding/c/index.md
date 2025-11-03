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