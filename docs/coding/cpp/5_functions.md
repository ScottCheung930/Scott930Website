# 函数

## 函数签名
函数签名包括函数名,参数类型,参数个数和顺序, 是一个函数的标识符. 在链接之前时, 不同的编译器会根据函数签名给出函数的名称修饰(符号修饰,mangled name). 这个修饰指明了在重载的情况下,具体调用哪个函数.

???+ Note
    如何查看函数签名?

    ```__func__```, 在C99以及C++11之后的**标准**中存在, 其类型是const char字符数组, 返回值是函数名称

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

    ```___FUNCTION__```, 非标准但是广泛支持, 在__func__出现前就在C和C++中被各家编译器使用, 直到C99和C++11引入__func__. 实际效果等同于__func__.

    ```__FUNCSIG__```, MSVC平台, 输出函数签名, 包含模板信息.

    ```__FUNCDNAME__```, MSVC平台, 输出函数修饰名, 是编译器链接所使用的名字.

    ``` c++
    void exampleFunction()
    {
        printf("Function name: %s\n", __FUNCTION__);
        printf("Decorated function name: %s\n", __FUNCDNAME__); //(1)!
        printf("Function signature: %s\n", __FUNCSIG__)
    }
    ```

    1. 
        ```
        Function name: exampleFunction
        Decorated function name: ?exampleFunction@@YAXXZ
        Function signature: void __cdecl exampleFunction(void)
        ```

    ```__PRETTY_FUNCTION__```, GCC/Clang, 类似于__FUNCSIG__, 包含模板信息.

    ``` c++
    template <typename T>
    void Foo::bar(T x) {
        std::cout << __PRETTY_FUNCTION__ << "\n";//(1)!
    }
    ```

    1. 
        ```
        void Foo::bar(T) [with T = int]
        ```
    
    对于跨平台需求, 使用条件编译来根据当前平台类型来把上述宏包装为一个自己的宏.

## 函数的重载
C语言中,函数签名不包括参数类型和顺序,所以不能重载同名但参数列表不同的函数.

C++中,函数签名包括参数类型和顺序,可以重载同名而参数类型/个数/顺序不同的函数.注意函数签名一般不包括返回值类型,因为返回值并不总是被使用,如果两个函数只有返回值类型不同且调用该函数后的返回值未被使用,则编译器缺乏信息推断究竟应调用哪个重载函数.

函数重载遇到默认参数时, 可能产生二义性(见后).

## 函数的默认参数

- 函数的默认参数只能放在参数列表末尾
- 若函数声明和定义分开,默认参数只能在声明中定义

``` c++

void func_1(int val_1 = 10)
{
    cout << val_1 << endl;
}
 
void func_2(int val_1 ,int val_2 = 10);
 
int main(int argc, char const *argv[])
{
    func_1();
    func_2(10);
    
    return 0;
}
 
void func_2(int val_1 ,int val_2)func_1();
{
    cout << val_1 << endl;
}
```

有默认参数的函数可能引起的二义性:
``` c++
#include <iostream>
using namespace std;
 
void func2(int a, int b = 10) {
    cout << "func2(int a, int b = 10) 调用" << endl;  // 带默认参数的函数
}
 
void func2(int a) {
    cout << "func2(int a) 调用" << endl;  // 无默认参数的函数
}
 
int main() {
    // func2(10);  // 这行代码会产生二义性
    func2(10, 20);  // 直接传递两个参数，明确调用两个参数的版本
    return 0;
}
```


## 函数与数组作为参数

借由指针实现的数组作为参数详见C语言复习;
简而言之, 数组会先变成指向数组的首元素的指针再传入, 同时形参声明的数组类型也会被视为指向数组元素的指针类型.

而传递对数组的引用, 在函数内部仍被视为数组.

???+ Note

    ``` c++
    #include <iostream>
    using namespace std;

    void TestArrPtr(int *datas){
        cout << "TestArrPtr " << sizeof datas << endl;
    }

    void TestArrRef(int (&datas)[10]){
        cout << "TestArrRef " << sizeof datas << endl;
    }

    int main(){
        int datas[10] = {1, 2, 3, 4, 5};
        TestArrRef(datas);
        TestArrPtr(datas);
    } 
    ```

    输出为(x64平台):

    ```
    TestArrRef 40
    TestArrPtr 8
    ```

## 函数与容器作为参数, 以及移动语义

容器作为参数, 有引用和按值传递. 即使按值传递也可以有优化:

``` c++
#include <iostream>
#include <vector>
using namespace std;

vector<int> testVector(vector<int> datas){
   cout << "testVector, datas"<<datas.data()<<endl;
   return datas;
}

int main(){
    vector<int> datas{1,2,3,4,5,6};

    cout<< "main, datas"<<datas.data()<<endl;
    auto datas1 = testVector(datas);
    cout<< "main, datas1" << datas1.data()<<endl;
}
```

```.data()```方法获得了容器的堆空间的首地址. 这段代码会输出三个地址，其中第二个地址和第三个地址相同，而第一个地址与第二第三个地址不同。因为在返回时, 自动使用了移动构造, 将局部对象datas所指的堆空间直接移动给了datas1(交换datas1和局部对象datas的```_begin/_end/_cap```指针, 见"容器"一节).

若使用```move()```, 还可以减少拷贝内存开销.
``` c++
#include <iostream>
#include <vector>
using namespace std;

vector<int> testVector(vector<int> datas){
    cout << "testVector, datas " << datas.data() << endl;
    return datas;
}

int main(){
    vector<int> datas{1,2,3,4,5,6};

    cout << "main, datas " << datas.data() << endl;
    auto datas1 = testVector(move(datas)); 
    cout << "main, datas1 " << datas1.data() << endl;
}

```
上方代码输出三个相同的地址.
```move()```将表达式强制转换成右值(xvalue), 告诉编译器将main函数的datas对象当成一个"可以被偷资源的临时对象", 则后续调用的构造函数/赋值运算符会优先匹配移动构造/移动赋值.

所以在传参之后, testVector函数使用了移动构造, 让作为形参的```datas```抢走了实参```datas```的内部指针```_begin/_end/_cap```. 之后, 同样地, 在返回时通过移动构造返回值来把这块堆空间交给了datas1.

事实上, 上述解释忽略了对象被同类型prvalue初始化时copy elision的作用, 在返回时理应先在testVector(datas)处构造一个临时对象ret, 而后再使用ret移动赋值给datas1. copy elision的作用是不构造临时对象ret, 而是直接构造datas1.
