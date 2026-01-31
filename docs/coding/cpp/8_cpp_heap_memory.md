# C++的堆内存管理特性

有关右值引用和移动语义的细节原理, 见[咸鱼暄的代码空间 > C++ > 右值引用与移动语义](https://xuan-insr.github.io/cpp/cpp_restart/9_move_semantics/)

## 拷贝构造和移动构造

### 拷贝构造
- 浅拷贝: 复制对象内存.
- 深拷贝: 复制对象内存以及复制对象成员指针指向的堆空间.

浅拷贝可能导致出现重复析构问题:
``` c++
class String{
public:
    String(const char* str){
        size_ = strlen(str);
        str_ = new char[size+1];
        memecpy(str_, str, size_+1);
        cout<<"String ctor "<< str_.c_str() <<endl;
    }
    ~String(){
        delete str_;
        str_ = nullptr;
        cout<<"String dtor "<< size_ <<endl;
        size_= 0;
        
    }
    const char* c_str(){
        if(!str_) return "";
        return str_;
    }

private:
    char* str_{nullptr};
    int size_{0};
}

void testString(String s){//注意此处没有用引用
    cout << s.c_str()<<endl;
}

int main(){
    String str1("test test");
    TestString(str1);
}
```
上述代码会最后报错, 因为在向```void testString()```传参时发生了自动的拷贝(浅拷贝), 指向堆内存的指针`str_`也一并被拷贝了, 局部对象`s`在函数结束时析构同时释放了`str_`指向的堆内存, 但在`main()`函数结束时又发生了`str1`的析构, 重复释放同一块内存导致了报错.

实现深拷贝依赖于**拷贝构造**, 拷贝构造是一种转换构造函数.
```A::A(const A& objA){...return objB;}```
对于上述例子, 可实现拷贝构造函数如下:
```c++
String(const String& s){
    size_ = s.size_;
    str_  = new char[size_+1];
    memcpy(str_, s.str_, size_+1);
    cout<<"String copy-ctor "<< str_.c_str() <<endl;
}
```
???+ Note 
    注意, 并非使用引用传参就完全不需要拷贝构造, 但凡"需要申请内存把参数的值存下来", 就很可能涉及到隐形的拷贝, 例如, 还是上文的`String`类, 定义一个`MyString`类包含`String`类成员变量并接受`String`类初始化:

    ```c++
    class MyString{
    public:
        MyString(String &s):str_(s){
            cout <<"MyString ctor " << str_.c_str()<<endl;
        }
    private:
        String str_;
    }
    ```

    MyString使用成员初始化器列表来初始化, 此时也会调用String的拷贝构造函数(拷贝传入的参数s去构造成员变量str_).

### 移动构造

原先的对象不保留, 其资源(内存)移动给新构造的对象, 不需要新申请内存.

???+ Note 移动语义
    当用对象A给对象B```B=A;```赋值, 且我们确保对象A再也不使用时, 我们此时最高效的办法是把A申请的空间直接移动给B(把A的堆指针与B互换), B对象就不需要申请空间, 大大降低了开销.

    例如, ```Type obj=func();```, ```func()```的返回值是个临时对象, 此时若能直接把临时对象的资源(堆内存)交给obj, 免去给obj申请内存的操作, 就能降低开销;

???+ Note value catagor: 左值, 纯右值, 将亡值
    首先需要明确: 
    1. "value catagory"是独立于"type"的属性; 
    2. "value catagory"是"表达式的类别"而非值的类别("The approach we take to provide guaranteed copy elision is to tweak the definition of C++'s 'glvalue' and 'prvalue' [value categories (which, counterintuitively, categorize expressions, not values).](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2015/p0135r0.html)")

    左值```lvalue```: 可以取地址, 是一个变量实体;

    纯右值```prvalue```: 只在乎其值语义(字面量, this指针, enum项);
    
    将亡值(临时但需要使用其地址的右值, expiring value)```xvalue```: 例如```Type obj = func()```, 在不使用NRVO(命名返回值优化)的情况下, func()的返回值对象是一个占有地址的临时对象, 当对象obj被返回值临时对象所赋值之后, 返回值对象就会被销毁.

???+ Note "为什么要有右值引用, 它解决了什么问题?"
    右值引用的"type"是引用类型, 其被解释为一个指针, 这个指针的特殊之处在于其指向一块即将被释放的内存(一个右值的内存, 所以我们不能将其当成一块普通内存处理, 故我们定义了右值引用这一特殊的类型来限制对这块内存的操作). 注意表达式的值类别(value category)与变量/表达式所求的值的类型(type)是两个独立的概念, 右值引用的命名是因为我们借助这种type来使用右值, 并不意味着引用本身是一个右值(相反, 有名变量是左值). 例如在```T && r = T{};move(r)```中, 右值引用```r```是一个lvalue, ```T{}```是一个prvalue, ```move(r)```是一个xvalue.

    右值引用最主要的用法之一就是移动语义和移动赋值: 移动将亡值的内存用以初始化/赋值新的对象. 具体的代码实现需要我们实现一个构造函数, 这个构造函数应该要针对将亡值做重载, 即我们采用一个将亡值作为构造参数时, 构造函数会移动该将亡值的内存. 

    在函数重载决议中存在 f(T&) 与 f(T&&) 这类对称重载时，xvalue 实参不能绑定到 T&，但可以绑定到 T&&，因此重载决议会选择 T&& 版本(例外是有const时, 如```move(const var)```只能绑定到```f(const T&&)```). 这也是移动构造/移动赋值会被编译器自动调用的原因, 同时我们也可以通过```move()```手动转换表达式为右值, 使其可以被绑定到右值引用的形参.
    
    引入右值引用的特殊性在于我们实现了更灵活的重载: 不是基于"type"(```f(int x)```和```f(string x)```), 而是基于一个变量的生存期阶段(是否将亡)/用途(其内存是否可被挪用). 

### Copy Elision和 NRVO

- Copy elision（省略拷贝/移动）是 C++ 标准允许（有时强制）的一类优化：
    在某些语境中，本来语言语义上“好像要”构造一个临时对象、再拷贝/移动到目标对象，但实现可以直接在目标位置构造，从而不调用 copy/move ctor。
    它是一个统称/大类，涵盖多种具体场景。

- **RVO（Return Value Optimization）和NRVO（Named RVO）**是 copy elision 在 return 场景 的两种典型形式：

    - RVO或URVO（通常指“未命名返回值”的 elision）
        例：```return T(...);``` 或 ```return make_T();```（返回一个 prvalue 临时）, 这里返回的是“未命名对象/临时对象”。

    - NRVO（Named Return Value Optimization）
        例：```T x; ...; return x;```（返回一个具名局部变量）,这里返回的是“有名字的局部对象”。

    RVO/NRVO 都是允许优化（permitted），不是必须. 用 ```-fno-elide-constructors``` 可以把它们大幅关掉. **注意RVO和NRVO不会在返回值是形参时生效**!

#### C++17 起的强制copy elision
有两个[强制copy elision的规则](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2015/p0135r0.html):用 prvalue初始化对象, 以及返回一个与返回值类型相同的prvalue. 注意, **返回值类型不是引用的函数调用表达式是prvalue**, 因此强制copy elision最常出现的两种情况通常涉及到函数调用表达式:

- 对于第一条规则, 有如下例子:
```c++
Foo makeFoo(Foo input) {
    return input; 
}
int main() {
    Foo foo = makeFoo(Foo{});
}
```
在这里, 由于返回值是形参, 不适用于NRVO, 所以c++此处的优化只可能是NRVO/RVO以外的copy elision. 
这段代码会有一次默认构造(input)和一次移动构造(intput -> foo). 若不考虑强制copy elision, 会从```Foo{}```默认构造临时对象, 再使用移动或拷贝构造从临时对象构造input, 最后移动构造foo, 共1次默认构造和两次移动构造.

- 对于第二条规则, 有如下例子:
```c++
T2 getT2(){
    ...
    return T2{}; 
}

int main(){
    T2 obj1=getT2();//返回一个与返回值类型相同的prvalue(表达式T2())
}
```
当然, 即便在C++17之前, 上述```T2 obj1=getT2();```也会被RVO优化掉移动构造, 但其优化依据的规则是不同的. 最大的区别是, 在C++17之前, T2必须有移动构造函数(即便明知会被优化掉), 而C++17之后, T2可以删除移动构造函数.

#### RVO和NRVO
下面的代码展示了使用C++ 11/17, 分别启用/禁用NRVO的输出. 可见在启用NRVO时, 无论是C++11还是C++17, 都没有移动构造, 在testString()中的s2的构造实际上是对main中的s1的构造. 而在禁用NRVO时, C++11有两次移动构造, C++17只有一次移动构造. 由于这里c++ 17有强制copy elision, 函数表达式testString()是prvalue, 根据copy elision的第一种规则, 在C++ 17中临时对象testString()->s1这一次初始化发生了elision, s2直接初始化了s1. 而C++ 11中没有强制copy elision, 因此对于C++11而言, 这一次elision是编译器可选的, 所以受```-fno-elide-constructors```编译选项控制(而C++ 17中, 这一次elision是语言层面强制的, 就不受编译选项控制了).

```c++
#include <iostream>
#include <cstring>
using namespace std;

class String
{
private:
    char* str_{nullptr};
    int size_{0};

public:
    String(const char* s){
        size_ = strlen(s) + 1;
        str_ = new char[size_];
        memcpy(str_, s, size_);
        cout << "String constructor: " << "\"" << str_ << "\" " << (size_t)((void *)str_) << endl;
    }

    String(const String& other){
        size_ = other.size_;
        str_ = new char[size_];
        memcpy(str_, other.str_, size_);
        cout << "String copy constructor: " << "\"" << str_ << "\" " << (size_t)((void *)str_) << endl;
    }

    String(String &&other) noexcept {
         swap(str_, other.str_);
         swap(size_, other.size_);
         cout << "String move constructor: " << "\"" << str_ << "\" " << (size_t)((void *)str_) << endl;
     }

    ~String()
    {
        cout << "String destructor: " << "Release size " << size_ << " at address " << (size_t)((void *)str_) << endl;
        delete[] str_;
        str_ = nullptr;
        size_ = 0;
    }

    const char* c_str() const {
        if(!str_) return "";
        return str_;
    }

    size_t data() const {
        return (size_t)((void*)str_);
    } 
};

String testString(String s2){
    String s2{s};
    cout << "testString, s2 " << s2.data() << endl;
    return s2;
}

int main(){
    String s("hello");
    cout << "main, s " << s.data() << endl;
    auto s1 = testString(s);
    cout << "main, s1 " << s1.data() << endl;
}

/*
1.
g++ -std=c++11 -fno-elide-constructors b.cpp -o b.exe
./b.exe

String constructor: "hello" 2513910633520
main, s 2513910633520
String copy constructor: "hello" 2513910633552
String copy constructor: "hello" 2513910634400
testString, s2 2513910634400
String move constructor: "hello" 2513910634400
String destructor: Release size 0 at address 0
String move constructor: "hello" 2513910634400
String destructor: Release size 0 at address 0
String destructor: Release size 6 at address 2513910633552
main, s1 2513910634400
String destructor: Release size 6 at address 2513910634400
String destructor: Release size 6 at address 2513910633520

2.
g++ -std=c++11 b.cpp -o b.exe
./b.exe

String constructor: "hello" 2032578729008
main, s 2032578729008
String copy constructor: "hello" 2032578729040
String copy constructor: "hello" 2032578729888
testString, s2 2032578729888
String destructor: Release size 6 at address 2032578729040
main, s1 2032578729888
String destructor: Release size 6 at address 2032578729888
String destructor: Release size 6 at address 2032578729008

3.
g++ -std=c++17 -fno-elide-constructors b.cpp -o b.exe
./b.exe

String constructor: "hello" 2535170708528
main, s 2535170708528
String copy constructor: "hello" 2535170708560
String copy constructor: "hello" 2535170709408
testString, s2 2535170709408
String move constructor: "hello" 2535170709408
String destructor: Release size 0 at address 0
String destructor: Release size 6 at address 2535170708560
main, s1 2535170709408
String destructor: Release size 6 at address 2535170709408
String destructor: Release size 6 at address 2535170708528

4.
g++ -std=c++17 b.cpp -o b.exe
./b.exe

String constructor: "hello" 2624135762992
main, s 2624135762992
String copy constructor: "hello" 2624135763024
String copy constructor: "hello" 2624135763872
testString, s2 2624135763872
String destructor: Release size 6 at address 2624135763024
main, s1 2624135763872
String destructor: Release size 6 at address 2624135763872
String destructor: Release size 6 at address 2624135762992

*/
```

## 运算符重载:拷贝赋值和移动赋值

### 运算符重载

### 拷贝赋值和移动赋值

## 智能指针

### unique_ptr

## 完美转发