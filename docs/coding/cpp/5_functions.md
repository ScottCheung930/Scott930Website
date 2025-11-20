# 函数

## 函数签名
函数签名包括函数名,参数类型,参数个数和顺序, 是一个函数的标识符. 在链接之前时, 不同的编译器会根据函数签名给出函数的名称修饰(符号修饰,mangled name). 这个修饰指明了在重载的情况下,具体调用哪个函数.

???+ Note
    如何查看函数签名?

    - ```__func__```, 在C99以及C++11之后的**标准**中存在, 其类型是const char字符数组, 返回值是函数名称
    
    ``` c++
    #include <string>
    #include <iostream>

    namespace Test
    {
        struct Foo
        {
            static void DoSomething(int i, std::string s)
            {
            std::cout << __func__ << std::endl; //(1)!
        };
    }

    int main()
    {
        Test::Foo::DoSomething(42, "Hello");

        return 0;
    }
    ```
    
    1. 
        输出
        ```
        DoSomething
        ```
   
    - ```___FUNCTION__```, 非标准但是广泛支持, 在__func__出现前就在C和C++中被各家编译器使用, 直到C99和C++11引入__func__. 实际效果等同于__func__.

    - ```__FUNCSIG__```, MSVC平台, 输出函数签名.

    - ```__FUNCDNAME__```, MSVC平台, 输出函数修饰名, 是编译器链接所使用的名字.

    ``` c++
    void exampleFunction()
    {
        printf("Function name: %s\n", __FUNCTION__);
        printf("Decorated function name: %s\n", __FUNCDNAME__);//(1)!
        printf("Function signature: %s\n", __FUNCSIG__)
    }
    ```

    1. 
        ```
        Function name: exampleFunction
        Decorated function name: ?exampleFunction@@YAXXZ
        Function signature: void __cdecl exampleFunction(void)
        ```




## 函数的重载
C语言中,函数签名不包括参数类型和顺序,所以不能重载同名但参数列表不同的函数.
C++中,函数签名包括参数类型和顺序,可以重载同名而参数类型/个数/顺序不同的函数.注意函数签名一般不包括返回值类型,因为返回值并不总是被使用,如果两个函数只有返回值类型不同且调用该函数后的返回值未被使用,则编译器缺乏信息推断究竟应调用哪个重载函数.

## 函数的默认参数

- 函数的默认参数只能放在参数列表末尾
- 若函数声明和定义分开,默认参数只能在声明中定义