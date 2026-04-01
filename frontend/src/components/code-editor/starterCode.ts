export const starterCode: Record<string, string> = {
  javascript: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,

  python: `def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

  typescript: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,

  php: `<?php
function greet($name) {
    return "Hello, $name!";
}

echo greet("World");
?>`,

  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hello World</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 50px;
    }
    h1 { color: black; }
  </style>
</head>
<body>
  <h1>This is a simple HTML + CSS + JS template!</h1>
  <script>
    console.log("Hello from JavaScript!");
  </script>
</body>
</html>`
};
