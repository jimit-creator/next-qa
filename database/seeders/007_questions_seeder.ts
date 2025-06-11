import { Seeder } from '@/lib/database/seeder';
import { Db, ObjectId } from 'mongodb';

const seeder: Seeder = {
  name: '007_questions_seeder',

  async run(db: Db) {
    const questions = db.collection('questions');
    const categories = db.collection('categories');

    // Check if questions already exist
    const existingCount = await questions.countDocuments();

    // if (existingCount > 0) {
    //   console.log('Questions already exist, skipping...');
    //   return;
    // }

    // Get category IDs
    const categoryDocs = await categories.find({}).toArray();
    const categoryMap = new Map(categoryDocs.map(cat => [cat.name, cat._id.toString()]));

    const sampleQuestions = [
      {
      "question": "What is AWS and what are its main services?",
      "answer": "<p>AWS (Amazon Web Services) is a comprehensive cloud computing platform offering over 200 fully featured services from data centers globally. The main services include:</p><ul><li>EC2 (Elastic Compute Cloud) - Virtual servers in the cloud</li><li>S3 (Simple Storage Service) - Object storage service</li><li>RDS (Relational Database Service) - Managed database service</li><li>Lambda - Serverless computing service</li><li>CloudFront - Content delivery network</li></ul>",
      "difficulty": "Easy",
      categoryId: categoryMap.get('AWS'),
      "tags": ["AWS", "Cloud Computing", "Infrastructure"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "Explain the difference between EC2 and Lambda?",
      "answer": "<p>EC2 and Lambda are both compute services but serve different purposes:</p><ul><li><strong>EC2:</strong> Provides virtual servers where you have full control over the operating system, applications, and configurations. You pay for the time the instance is running.</li><li><strong>Lambda:</strong> Serverless computing service that runs code in response to events. You only pay for the compute time you consume. No server management required.</li></ul><p>Example Lambda function:</p><pre><code>exports.handler = async (event) => {\n    const response = {\n        statusCode: 200,\n        body: JSON.stringify('Hello from Lambda!'),\n    };\n    return response;\n};</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["EC2", "Lambda", "Serverless"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is S3 and how does it work?",
      "answer": "<p>Amazon S3 (Simple Storage Service) is an object storage service that offers industry-leading scalability, data availability, security, and performance. Key features include:</p><ul><li>Unlimited storage capacity</li><li>99.999999999% durability</li><li>Versioning support</li><li>Lifecycle management</li><li>Cross-region replication</li></ul><p>Example S3 bucket policy:</p><pre><code>{\n    \"Version\": \"2012-10-17\",\n    \"Statement\": [\n        {\n            \"Sid\": \"PublicReadGetObject\",\n            \"Effect\": \"Allow\",\n            \"Principal\": \"*\",\n            \"Action\": \"s3:GetObject\",\n            \"Resource\": \"arn:aws:s3:::my-bucket/*\"\n        }\n    ]\n}</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["S3", "Storage", "Object Storage"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is VPC and why is it important?",
      "answer": "<p>VPC (Virtual Private Cloud) is a virtual network dedicated to your AWS account. It provides:</p><ul><li>Isolated network environment</li><li>Custom IP address ranges</li><li>Subnet creation</li><li>Route table configuration</li><li>Network gateways</li></ul><p>Example VPC configuration:</p><pre><code>VPC CIDR: 10.0.0.0/16\nPublic Subnet: 10.0.1.0/24 (us-east-1a)\nPrivate Subnet: 10.0.2.0/24 (us-east-1b)\nInternet Gateway: attached to VPC\nNAT Gateway: in public subnet</code></pre>",
      "difficulty": "Hard",
      categoryId: categoryMap.get('AWS'),
      "tags": ["VPC", "Networking", "Security"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "Explain the concept of Auto Scaling in AWS",
      "answer": "<p>Auto Scaling helps maintain application availability and allows you to scale your EC2 capacity up or down automatically according to conditions you define. Key features:</p><ul><li>Maintains desired number of instances</li><li>Automatically replaces unhealthy instances</li><li>Scales based on demand</li><li>Cost optimization</li></ul><p>Example Auto Scaling configuration:</p><pre><code>{\n    \"AutoScalingGroupName\": \"my-asg\",\n    \"MinSize\": 2,\n    \"MaxSize\": 10,\n    \"DesiredCapacity\": 4,\n    \"TargetGroupARNs\": [\"arn:aws:elasticloadbalancing:...\"],\n    \"VPCZoneIdentifier\": [\"subnet-123456\", \"subnet-789012\"]\n}</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["Auto Scaling", "EC2", "High Availability"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is CloudFormation and how does it work?",
      "answer": "<p>AWS CloudFormation is a service that helps you model and set up AWS resources so you can spend less time managing those resources and more time focusing on your applications. Key benefits:</p><ul><li>Infrastructure as Code (IaC)</li><li>Automated deployment</li><li>Version control for infrastructure</li><li>Reusable templates</li></ul><p>Example CloudFormation template:</p><pre><code>AWSTemplateFormatVersion: '2010-09-09'\nResources:\n  MyEC2Instance:\n    Type: AWS::EC2::Instance\n    Properties:\n      ImageId: ami-123456\n      InstanceType: t2.micro\n      KeyName: my-key-pair\n      SecurityGroups: \n        - default</code></pre>",
      "difficulty": "Hard",
      categoryId: categoryMap.get('AWS'),
      "tags": ["CloudFormation", "IaC", "DevOps"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is IAM and what are its main components?",
      "answer": "<p>IAM (Identity and Access Management) is a web service that helps you securely control access to AWS resources. Main components:</p><ul><li>Users - Individual AWS accounts</li><li>Groups - Collection of users</li><li>Roles - Temporary permissions</li><li>Policies - JSON documents defining permissions</li></ul><p>Example IAM policy:</p><pre><code>{\n    \"Version\": \"2012-10-17\",\n    \"Statement\": [\n        {\n            \"Effect\": \"Allow\",\n            \"Action\": [\n                \"s3:GetObject\",\n                \"s3:PutObject\"\n            ],\n            \"Resource\": \"arn:aws:s3:::my-bucket/*\"\n        }\n    ]\n}</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["IAM", "Security", "Access Control"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "Explain the concept of AWS Lambda and its use cases",
      "answer": "<p>AWS Lambda is a serverless computing service that runs code in response to events. Key features and use cases:</p><ul><li>Event-driven execution</li><li>Pay-per-use pricing</li><li>Automatic scaling</li><li>No server management</li></ul><p>Common use cases:</p><ul><li>Processing S3 events</li><li>API Gateway integration</li><li>Database triggers</li><li>Scheduled tasks</li></ul><p>Example Lambda function:</p><pre><code>exports.handler = async (event) => {\n    const s3Event = event.Records[0].s3;\n    const bucket = s3Event.bucket.name;\n    const key = s3Event.object.key;\n    \n    // Process the S3 object\n    console.log(`Processing ${key} from ${bucket}`);\n    \n    return {\n        statusCode: 200,\n        body: 'Processing complete'\n    };\n};</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["Lambda", "Serverless", "Event-Driven"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is Route 53 and how does it work?",
      "answer": "<p>Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service. Key features:</p><ul><li>Domain registration</li><li>DNS routing</li><li>Health checking</li><li>Traffic flow</li><li>Latency-based routing</li></ul><p>Example Route 53 record set:</p><pre><code>{\n    \"Name\": \"example.com\",\n    \"Type\": \"A\",\n    \"TTL\": 300,\n    \"ResourceRecords\": [\n        {\n            \"Value\": \"192.0.2.1\"\n        }\n    ],\n    \"HealthCheckId\": \"abcdef12-3456-7890-abcd-ef1234567890\"\n}</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["Route 53", "DNS", "Networking"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is CloudWatch and what can it monitor?",
      "answer": "<p>Amazon CloudWatch is a monitoring and observability service that provides data and actionable insights for AWS resources and applications. It can monitor:</p><ul><li>EC2 instances</li><li>RDS databases</li><li>Lambda functions</li><li>Custom metrics</li><li>Logs</li></ul><p>Example CloudWatch alarm:</p><pre><code>{\n    \"AlarmName\": \"HighCPUUtilization\",\n    \"ComparisonOperator\": \"GreaterThanThreshold\",\n    \"EvaluationPeriods\": 2,\n    \"MetricName\": \"CPUUtilization\",\n    \"Namespace\": \"AWS/EC2\",\n    \"Period\": 300,\n    \"Statistic\": \"Average\",\n    \"Threshold\": 80.0,\n    \"AlarmActions\": [\"arn:aws:sns:region:account-id:topic-name\"]\n}</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["CloudWatch", "Monitoring", "Logging"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is AWS RDS and what are its supported database engines?",
      "answer": "<p>Amazon RDS (Relational Database Service) is a managed database service that makes it easy to set up, operate, and scale relational databases in the cloud. Supported database engines include:</p><ul><li>MySQL</li><li>PostgreSQL</li><li>MariaDB</li><li>Oracle</li><li>Microsoft SQL Server</li><li>Amazon Aurora</li></ul><p>Example RDS instance configuration:</p><pre><code>{\n    \"DBInstanceIdentifier\": \"my-db-instance\",\n    \"Engine\": \"mysql\",\n    \"DBInstanceClass\": \"db.t3.micro\",\n    \"AllocatedStorage\": 20,\n    \"MasterUsername\": \"admin\",\n    \"MultiAZ\": true,\n    \"BackupRetentionPeriod\": 7\n}</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["RDS", "Database", "MySQL", "PostgreSQL"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is DynamoDB and when should you use it?",
      "answer": "<p>Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability. Key features:</p><ul><li>Single-digit millisecond performance</li><li>Built-in security and backup</li><li>Automatic scaling</li><li>Global tables for multi-region replication</li></ul><p>Example DynamoDB table creation:</p><pre><code>{\n    \"TableName\": \"Users\",\n    \"KeySchema\": [\n        {\n            \"AttributeName\": \"UserId\",\n            \"KeyType\": \"HASH\"\n        }\n    ],\n    \"AttributeDefinitions\": [\n        {\n            \"AttributeName\": \"UserId\",\n            \"AttributeType\": \"S\"\n        }\n    ],\n    \"ProvisionedThroughput\": {\n        \"ReadCapacityUnits\": 5,\n        \"WriteCapacityUnits\": 5\n    }\n}</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["DynamoDB", "NoSQL", "Database"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "Explain the concept of AWS Elastic Beanstalk",
      "answer": "<p>AWS Elastic Beanstalk is a Platform as a Service (PaaS) that makes it easy to deploy and manage applications in the AWS Cloud. Key features:</p><ul><li>Automated deployment</li><li>Built-in load balancing</li><li>Auto-scaling</li><li>Health monitoring</li><li>Multiple platform support</li></ul><p>Example Elastic Beanstalk configuration:</p><pre><code>{\n    \"AWSEBDockerrunVersion\": \"1\",\n    \"Image\": {\n        \"Name\": \"my-app:latest\",\n        \"Update\": \"true\"\n    },\n    \"Ports\": [\n        {\n            \"ContainerPort\": 80,\n            \"HostPort\": 80\n        }\n    ]\n}</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["Elastic Beanstalk", "Deployment", "PaaS"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is AWS CloudFront and how does it work?",
      "answer": "<p>Amazon CloudFront is a content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency. Key features:</p><ul><li>Global edge locations</li><li>SSL/TLS encryption</li><li>Real-time logs</li><li>Field-level encryption</li><li>Origin failover</li></ul><p>Example CloudFront distribution configuration:</p><pre><code>{\n    \"DistributionConfig\": {\n        \"Origins\": {\n            \"Items\": [\n                {\n                    \"Id\": \"S3-Origin\",\n                    \"DomainName\": \"my-bucket.s3.amazonaws.com\",\n                    \"S3OriginConfig\": {\n                        \"OriginAccessIdentity\": \"\"\n                    }\n                }\n            ]\n        },\n        \"DefaultCacheBehavior\": {\n            \"TargetOriginId\": \"S3-Origin\",\n            \"ViewerProtocolPolicy\": \"redirect-to-https\",\n            \"MinTTL\": 0,\n            \"DefaultTTL\": 86400,\n            \"MaxTTL\": 31536000\n        },\n        \"Enabled\": true\n    }\n}</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["CloudFront", "CDN", "Content Delivery"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is AWS SQS and when should you use it?",
      "answer": "<p>Amazon SQS (Simple Queue Service) is a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications. Key features:</p><ul><li>FIFO and Standard queues</li><li>Message retention up to 14 days</li><li>Dead-letter queues</li><li>Message encryption</li><li>Long polling</li></ul><p>Example SQS message sending:</p><pre><code>const AWS = require('aws-sdk');\nconst sqs = new AWS.SQS();\n\nconst params = {\n    QueueUrl: 'https://sqs.region.amazonaws.com/account-id/queue-name',\n    MessageBody: JSON.stringify({\n        orderId: '12345',\n        customerId: '67890',\n        amount: 99.99\n    }),\n    MessageAttributes: {\n        'OrderType': {\n            DataType: 'String',\n            StringValue: 'Standard'\n        }\n    }\n};\n\nsqs.sendMessage(params).promise();</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["SQS", "Message Queue", "Microservices"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is AWS SNS and how does it differ from SQS?",
      "answer": "<p>Amazon SNS (Simple Notification Service) is a fully managed messaging service for both application-to-application (A2A) and application-to-person (A2P) communication. Key differences from SQS:</p><ul><li>SNS is a pub/sub service, while SQS is a queue service</li><li>SNS can deliver to multiple subscribers, SQS to one consumer</li><li>SNS supports multiple protocols (HTTP, HTTPS, Email, SMS)</li><li>SNS doesn't store messages, SQS does</li></ul><p>Example SNS topic creation and subscription:</p><pre><code>{\n    \"TopicArn\": \"arn:aws:sns:region:account-id:my-topic\",\n    \"Protocol\": \"email\",\n    \"Endpoint\": \"user@example.com\",\n    \"Attributes\": {\n        \"DisplayName\": \"My Notification Topic\",\n        \"Policy\": {\n            \"Version\": \"2012-10-17\",\n            \"Statement\": [\n                {\n                    \"Effect\": \"Allow\",\n                    \"Principal\": {\"AWS\": \"*\"},\n                    \"Action\": \"SNS:Publish\",\n                    \"Resource\": \"arn:aws:sns:region:account-id:my-topic\"\n                }\n            ]\n        }\n    }\n}</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["SNS", "Notifications", "Pub/Sub"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is AWS KMS and how is it used for encryption?",
      "answer": "<p>AWS KMS (Key Management Service) is a managed service that makes it easy to create and control the encryption keys used to encrypt your data. Key features:</p><ul><li>Centralized key management</li><li>Automatic key rotation</li><li>Integration with AWS services</li><li>Hardware security module (HSM) support</li><li>Audit logging</li></ul><p>Example KMS key policy:</p><pre><code>{\n    \"Version\": \"2012-10-17\",\n    \"Statement\": [\n        {\n            \"Sid\": \"Enable IAM User Permissions\",\n            \"Effect\": \"Allow\",\n            \"Principal\": {\n                \"AWS\": \"arn:aws:iam::account-id:root\"\n            },\n            \"Action\": \"kms:*\",\n            \"Resource\": \"*\"\n        },\n        {\n            \"Sid\": \"Allow use of the key\",\n            \"Effect\": \"Allow\",\n            \"Principal\": {\n                \"AWS\": \"arn:aws:iam::account-id:user/example-user\"\n            },\n            \"Action\": [\n                \"kms:Encrypt\",\n                \"kms:Decrypt\",\n                \"kms:ReEncrypt*\",\n                \"kms:GenerateDataKey*\",\n                \"kms:DescribeKey\"\n            ],\n            \"Resource\": \"*\"\n        }\n    ]\n}</code></pre>",
      "difficulty": "Hard",
      categoryId: categoryMap.get('AWS'),
      "tags": ["KMS", "Encryption", "Security"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    },
    {
      "question": "What is AWS CloudTrail and what does it track?",
      "answer": "<p>AWS CloudTrail is a service that enables governance, compliance, operational auditing, and risk auditing of your AWS account. It tracks:</p><ul><li>API calls and actions</li><li>User activity</li><li>Resource changes</li><li>Console sign-in events</li><li>Management events</li></ul><p>Example CloudTrail event:</p><pre><code>{\n    \"eventVersion\": \"1.08\",\n    \"userIdentity\": {\n        \"type\": \"IAMUser\",\n        \"principalId\": \"EX_PRINCIPAL_ID\",\n        \"arn\": \"arn:aws:iam::123456789012:user/example-user\",\n        \"accountId\": \"123456789012\",\n        \"userName\": \"example-user\"\n    },\n    \"eventTime\": \"2024-03-20T12:00:00Z\",\n    \"eventSource\": \"ec2.amazonaws.com\",\n    \"eventName\": \"RunInstances\",\n    \"awsRegion\": \"us-east-1\",\n    \"sourceIPAddress\": \"192.0.2.0\",\n    \"userAgent\": \"aws-cli/1.29.29\",\n    \"requestParameters\": {\n        \"instancesSet\": {\n            \"items\": [\n                {\n                    \"imageId\": \"ami-12345678\",\n                    \"instanceType\": \"t2.micro\"\n                }\n            ]\n        }\n    },\n    \"responseElements\": {\n        \"instancesSet\": {\n            \"items\": [\n                {\n                    \"instanceId\": \"i-1234567890abcdef0\"\n                }\n            ]\n        }\n    }\n}</code></pre>",
      "difficulty": "Medium",
      categoryId: categoryMap.get('AWS'),
      "tags": ["CloudTrail", "Auditing", "Compliance"],
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    }
    ];

    // Filter out questions for categories that don't exist
    const validQuestions = sampleQuestions.filter(q => q.categoryId);

    await questions.insertMany(validQuestions);
    console.log(`Created ${validQuestions.length} sample questions`);
  }
};

export default seeder;