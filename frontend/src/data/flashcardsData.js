// flashcardsData.js
export const flashcards = {
    "Route 53": `
      - EC2 cannot be a pointed to by an Alias record.
      - Primary record must have a health check for failover routing policy.
      - **Failure Threshold** is the parameter used by Route 53 health checks to determine if an endpoint is healthy.
    `,
    "ELB": `
      - ELB has access logs.
      - ALB, NLB, and CloudFront support SNI.
      - Session affinity is supported by CLB and ALB (layer 7).
    `,
    "API Gateway": `
      - For HTTP_PROXY integration type, add HTTP headers in the request (e.g., API key).
      - Mapping template uses **Velocity Template Language (VTL)**.
      - Private endpoints can only be accessed within your VPC using an Interface VPC endpoint (ENI).
    `,
    "ECS": `
      - Use **Elastic Beanstalk** for automated resource provisioning.
      - **ECS Cluster Capacity Provider** automatically scales EC2 instances.
      - Use **advanced container definition parameters** for environment variables.
    `,
    "ASG": `
      - Supports predictive scaling using machine learning.
    `,
    "CloudFormation": `
      - Parameters can be modified without having to re-upload the template.
      - **Exported output name** must be unique within a region.
      - **Stack Policy** defines allowed update actions during stack updates.
    `,
    // Add other topics similarly...
  };
  