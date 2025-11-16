# 输入输出
- cin 标准输入流
- cout 标准输出流
- cerr 标准错误流

### 输入字符和string类字符串

- ```cin >> str``` 会默认以空格作为输入结尾（空格仍保留在输入流中）
- 读入包含空格的一整行: ```getline(cin, line_var)```
- 读入一行直到指定分隔符：```getline(cin, line_var, delimeter)```

### 输出格式控制符

```#include <iomanip>```

设定宽度(设定后全局保持有效): 
```cpp
cout << setw(4) << num;
```

设定小数精度: 
```cpp
double num = 1.23456;
cout << setprecision(3) << num; //得到1.235
```

设定定点小数
```cpp
double num = 1.2,num2 = 1.2345;
cout << fixed<<setprecission(3)<<num; //1.200
cout << fixed<<setprecission(3)<<num2; //1.235
```

设置前导零
```cpp
cout << setw(4) <<setfill('0')<< 1 //得到0001
```

设置左/右对齐
```cpp
cout << left<<num;
cout << right << num;
```

### 输入一行数字直到换行
```cpp
int num;
while(cin >> num){
    if(cin.getc()=='\n'){
        break;
    }
}
```

### istringstream, ostringstream

istringstream 可以作为输入流；
ostringstream 可以作为输出流；

输入空格分隔的一行多整数
```cpp
string line = "10 20 30"
istringstream iss(line);
int x;
vector<int> a;
while(iss>>x) a.push_back(x);
```

输入指定分隔符的元素
```cpp
string s = "1.2.3.4"
istringstream iss(s);
string part;
while(getline(iss,part,'.')){
    //part可能为空，例如"1..3"会得到一个空part
}
```

自定义输入函数
```cpp

vector<int> parseInput(string& s){
    istringstream iss(s);
    vector<int> nums;
    string part;
    while(getline(iss,part,'.')){
        nums.push_back(stoi(part));
    }
    return nums;
}


int main(){
    string s;
    getline(cin,s);
    vector<int> nums;
    nums=parseInput(s);
}

```

实现类似sprintf的输出到字符串
```cpp
double x = 3.14159; int n = 7;
ostringstream oss;
oss << "x=" << fixed << setprecision(2) << x
    << ", n=" << setw(3) << setfill('0') << n; // 001
string out = oss.str();   // "x=3.14, n=007"
```

构造错误/日志信息
```cpp
int row = 5, col = -1;
ostringstream oss;
oss << "Invalid index (" << row << ", " << col << ")";
throw runtime_error(oss.str());
```