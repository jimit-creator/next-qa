import { Seeder } from '@/lib/database/seeder';
import { Db, ObjectId } from 'mongodb';

const seeder: Seeder = {
  name: '003_questions_seeder',
  
  async run(db: Db) {
    const questions = db.collection('questions');
    const categories = db.collection('categories');
    
    // Check if questions already exist
    const existingCount = await questions.countDocuments();
    
    if (existingCount > 0) {
      console.log('Questions already exist, skipping...');
      return;
    }
    
    // Get category IDs
    const categoryDocs = await categories.find({}).toArray();
    const categoryMap = new Map(categoryDocs.map(cat => [cat.name, cat._id.toString()]));
    
    const sampleQuestions = [
      // JavaScript Questions
      {
        question: 'What is the difference between let, const, and var in JavaScript?',
        answer: 'var is function-scoped and can be redeclared and reassigned. let is block-scoped, can be reassigned but not redeclared in the same scope. const is block-scoped, cannot be reassigned or redeclared, but objects/arrays can still be mutated.',
        categoryId: categoryMap.get('JavaScript'),
        difficulty: 'Medium',
        tags: ['variables', 'scope', 'es6'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Explain closures in JavaScript with an example.',
        answer: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Example: function outer(x) { return function inner(y) { return x + y; }; } const add5 = outer(5); add5(3); // returns 8',
        categoryId: categoryMap.get('JavaScript'),
        difficulty: 'Hard',
        tags: ['closures', 'scope', 'functions'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is the event loop in JavaScript?',
        answer: 'The event loop is a mechanism that handles asynchronous operations in JavaScript. It continuously checks the call stack and task queue, moving tasks from the queue to the stack when the stack is empty.',
        categoryId: categoryMap.get('JavaScript'),
        difficulty: 'Hard',
        tags: ['event-loop', 'async', 'concurrency'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // React Questions
      {
        question: 'What is the Virtual DOM in React?',
        answer: 'The Virtual DOM is a JavaScript representation of the actual DOM. React uses it to optimize rendering by comparing the virtual DOM with the previous version (diffing) and only updating the parts that have changed (reconciliation).',
        categoryId: categoryMap.get('React'),
        difficulty: 'Medium',
        tags: ['virtual-dom', 'performance', 'reconciliation'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Explain the difference between useState and useEffect hooks.',
        answer: 'useState manages component state and returns a state value and setter function. useEffect handles side effects like API calls, subscriptions, or DOM manipulation, and runs after render with optional cleanup.',
        categoryId: categoryMap.get('React'),
        difficulty: 'Medium',
        tags: ['hooks', 'state', 'effects'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is prop drilling and how can you avoid it?',
        answer: 'Prop drilling is passing props through multiple component layers to reach a deeply nested component. Solutions include Context API, state management libraries (Redux, Zustand), or component composition patterns.',
        categoryId: categoryMap.get('React'),
        difficulty: 'Medium',
        tags: ['props', 'context', 'state-management'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // Node.js Questions
      {
        question: 'What is the event loop in Node.js?',
        answer: 'The event loop allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible. It has phases: timers, pending callbacks, idle/prepare, poll, check, and close callbacks.',
        categoryId: categoryMap.get('Node.js'),
        difficulty: 'Hard',
        tags: ['event-loop', 'async', 'non-blocking'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Explain middleware in Express.js.',
        answer: 'Middleware functions execute during the request-response cycle. They have access to req, res, and next objects. They can execute code, modify req/res objects, end the request-response cycle, or call the next middleware.',
        categoryId: categoryMap.get('Node.js'),
        difficulty: 'Medium',
        tags: ['express', 'middleware', 'request-response'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // TypeScript Questions
      {
        question: 'What are generics in TypeScript?',
        answer: 'Generics allow you to create reusable components that work with multiple types while maintaining type safety. Example: function identity<T>(arg: T): T { return arg; }',
        categoryId: categoryMap.get('TypeScript'),
        difficulty: 'Medium',
        tags: ['generics', 'types', 'reusability'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Explain the difference between interface and type in TypeScript.',
        answer: 'Interfaces are extendable and can be merged, primarily for object shapes. Types are more flexible, support unions/intersections, and cannot be merged. Use interfaces for object contracts, types for complex type definitions.',
        categoryId: categoryMap.get('TypeScript'),
        difficulty: 'Medium',
        tags: ['interface', 'type', 'object-types'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    // Filter out questions for categories that don't exist
    const validQuestions = sampleQuestions.filter(q => q.categoryId);
    
    await questions.insertMany(validQuestions);
    console.log(`Created ${validQuestions.length} sample questions`);
  }
};

export default seeder;