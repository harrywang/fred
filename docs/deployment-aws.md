# AWS Deployment

## Setup IAM User

Setup IAM users
- Create the users: "Attach existing policies directly" with "Administrator Access" and "Billing"
to view billing
<img width="394" alt="Screen Shot 2020-04-15 at 1 15 14 PM" src="https://user-images.githubusercontent.com/595772/79367051-31870c00-7f1b-11ea-9b25-fe2129cb0633.png">
- Write down the `AWS Access Key ID` and `AWS Secret Access Key`
- Do not forget to enable the billing console access: [instruction](https://aws.amazon.com/blogs/security/dont-forget-to-enable-access-to-the-billing-console/)

## Configure AWS CLI

- Install awscli
```
$ pip3 install awscli
$ aws --version
aws-cli/1.18.39 Python/3.7.7 Darwin/19.4.0 botocore/1.15.39
```

- Configure AWS CLI:
  - AWS regions and codes: [doc](https://docs.aws.amazon.com/general/latest/gr/rande.html)
      - US East (N. Virginia), code: us-east-1, slightly cheaper than Singapore
      - Asia Pacific (Singapore), code `ap-southeast-1`
  - AWS CLI uses two files to store the sensitive credential information (in ~/.aws/credentials) separated from the less sensitive configuration options (in ~/.aws/config). See the [doc](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).
  - Run the following commands to setup and check cli is working (s3 does not have region)
  ```
  $ aws configure
  AWS Access Key ID [None]: A6NxxxxxZDKKB
  AWS Secret Access Key [None]: VLxxxx2fZWhr
  Default region name [None]: us-east-1
  Default output format [None]: json

  $ ls ~/.aws
  config		credentials

  $ aws s3 ls
  ```

## Configure ECR and Dev Build Images
AWS ECR (Elastic Container Registry) is part of AWS ECS (Elastic Container Service):

<img width="300" alt="Screen Shot 2020-04-15 at 1 34 04 PM" src="https://user-images.githubusercontent.com/595772/79368725-ddc9f200-7f1d-11ea-842d-a88d6e2557ef.png">

Go to Amazon ECS, click "Repositories", and then add two new repositories:
- fred-backend: `aws ecr create-repository --repository-name fred-backend --region us-east-1`
- fred-frontend: `aws ecr create-repository --repository-name fred-frontend --region us-east-1`

<img width="1245" alt="Screen Shot 2020-04-15 at 1 36 54 PM" src="https://user-images.githubusercontent.com/595772/79369305-bde6fe00-7f1e-11ea-888d-0c575edc392e.png">

Get the <AWS_ACCOUNT_ID> and the related URIs as shown in the screenshot above and build the images locally with tags (dev in this case):

```
docker build \
  -f services/backend/Dockerfile \
  -t <ECR-fred-backend-repo-URI>:dev \
  ./services/backend

  docker build \
    -f services/frontend/Dockerfile \
    -t <ECR-fred-frontend-repo-URI>:dev \
    ./services/frontend
```
After this, do `docker image ls` locally, you should see the two newly built images:

<img width="494" alt="Screen Shot 2020-04-15 at 1 58 52 PM" src="https://user-images.githubusercontent.com/595772/79371061-c2f97c80-7f21-11ea-9ced-c250a7d1cc1a.png">

Now, we are going to push the dev build images to ECR. If you check the repositories your created above, they should be empty:
<img width="963" alt="Screen Shot 2020-04-15 at 2 07 05 PM" src="https://user-images.githubusercontent.com/595772/79371455-69458200-7f22-11ea-857b-5723f301b703.png">

Next, let's push the two images you just built locally on your computer to the repositories.

First, you need to login to AWS ECR by using the following command: `aws ecr get-login-password --region us-east-1` generates the long password, which is piped to `docker login` to login with default username "AWS" - don't forget to change the account id or the region you chose. See [doc](https://docs.aws.amazon.com/cli/latest/reference/ecr/get-login-password.html)

```
aws ecr get-login-password --region us-east-1 \
      | docker login --username AWS --password-stdin \
      <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```
Next, use the following commands to push the images to the ECR repositories (it may take a while given the image sizes are about 400M and 800M):

```
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/fred-backend:dev
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/fred-frontend:dev
```

Once this is done, you should be able to the images in ECR:
<img width="961" alt="Screen Shot 2020-04-15 at 2 21 09 PM" src="https://user-images.githubusercontent.com/595772/79373347-73688000-7f24-11ea-807d-ea3b1f0ac616.png">

## Configure Production Build Images

Create/update the following files:
- update `services/db/create.sql`: add `CREATE DATABASE app_prod;`
- add `services/backend/Dockerfile.prod`
- add `services/frontend/Dockerfile.prod`
- add `services/frontend/nginx/aws/default.conf`: this file is used to overwrite the default nginx configuration
- add `docker-compose.prod.yml`


Then, test out the production images locally:

```
$ docker-compose down -v
$ docker-compose -f docker-compose.prod.yml up -d --build
$ docker-compose -f docker-compose.prod.yml exec backend python manage.py reset_db
$ docker-compose -f docker-compose.prod.yml exec backend python manage.py load_data
```

Test it out at http://localhost:3007/

Build the production images with the `prod` tag:

```
$ docker build \
    -f services/backend/Dockerfile.prod \
    -t <ECR-fred-backend-repo-URI>:prod \
    ./services/backend

$ docker build \
    -f services/frontend/Dockerfile.prod \
    -t <ECR-fred-frontend-repo-URI>:prod \
    --build-arg NODE_ENV=production \
    --build-arg REACT_APP_USERS_SERVICE_URL=${REACT_APP_USERS_SERVICE_URL} \
    ./services/frontend
```

You should see the new production images using `docker image ls` (you can see the frontend production image size is much smaller than the dev image):

<img width="487" alt="Screen Shot 2020-04-15 at 7 12 27 PM" src="https://user-images.githubusercontent.com/595772/79397843-2056f300-7f4d-11ea-872c-692efbf3f796.png">

Now, push the production images to ECR:
```
$ docker push <ECR-fred-backend-repo-URI>:prod
$ docker push <ECR-fred-frontend-repo-URI>:prod
```

You can see the production images on ECR:

<img width="963" alt="Screen Shot 2020-04-15 at 7 21 01 PM" src="https://user-images.githubusercontent.com/595772/79398275-44670400-7f4e-11ea-8ab0-79ec32fd1c23.png">

## Configure CodeBuild

Go to the CodeBuild dashboard and click "Create project":

<img width="712" alt="Screen Shot 2020-04-15 at 7 27 27 PM" src="https://user-images.githubusercontent.com/595772/79398649-2b128780-7f4f-11ea-982a-9b0426208b20.png">

Follow the screenshots below:

<img width="840" alt="Screen Shot 2020-04-15 at 7 30 47 PM" src="https://user-images.githubusercontent.com/595772/79399161-9a3cab80-7f50-11ea-84e3-a87fa082bcce.png">

<img width="840" alt="Screen Shot 2020-04-15 at 7 29 04 PM" src="https://user-images.githubusercontent.com/595772/79399165-9f015f80-7f50-11ea-8110-df8fe5f8baf6.png">

<img width="818" alt="Screen Shot 2020-04-15 at 7 31 30 PM" src="https://user-images.githubusercontent.com/595772/79399178-ab85b800-7f50-11ea-9013-c613f2c98b6e.png">

<img width="836" alt="Screen Shot 2020-04-15 at 7 32 28 PM" src="https://user-images.githubusercontent.com/595772/79399217-c1937880-7f50-11ea-8676-565b968c5a9b.png">

<img width="837" alt="Screen Shot 2020-04-15 at 7 34 40 PM" src="https://user-images.githubusercontent.com/595772/79399225-c5bf9600-7f50-11ea-9c38-60179ccc31a7.png">

<img width="826" alt="Screen Shot 2020-04-15 at 7 36 07 PM" src="https://user-images.githubusercontent.com/595772/79399229-c9531d00-7f50-11ea-9fa1-bb6ef4e37bd5.png">

<img width="929" alt="Screen Shot 2020-04-15 at 7 36 40 PM" src="https://user-images.githubusercontent.com/595772/79399232-cb1ce080-7f50-11ea-8c22-37f54b588a9b.png">

**NOTE**: add the AmazonEC2ContainerRegistryPowerUser policy to the `codebuild-my-fra-service-role` role using IAM dashboard.
<img width="979" alt="Screen Shot 2020-04-15 at 7 47 54 PM" src="https://user-images.githubusercontent.com/595772/79399711-14216480-7f52-11ea-9b2e-59471ead8211.png">

Then, add `buildspec.yml`, push the code to Github and build in CodeBuild. Make sure it succeeded:
<img width="891" alt="Screen Shot 2020-04-15 at 10 42 33 PM" src="https://user-images.githubusercontent.com/595772/79408924-8c941f80-7f6a-11ea-8ed5-b8b31ccbeccf.png">

## EC2-Classic vs. EC2-VPC

My AWS is quite old and was using EC2-Class. The new accounts are created only for EC2-VPC. I have to contact AWS to switch to the new EC2-VPC.

Each AWS has a default VPC for each region. If the default VPC is deleted. You can use the following command to re-create one: `aws ec2 create-default-vpc`

## Configure Load Balancer

<img width="1044" alt="Screen Shot 2020-04-16 at 10 52 32 AM" src="https://user-images.githubusercontent.com/595772/79471286-6ef9a100-7fd0-11ea-8dd6-33f99a29edc6.png">

Create "Application Load Balancer" (ALB):

<img width="430" alt="Screen Shot 2020-04-16 at 10 53 18 AM" src="https://user-images.githubusercontent.com/595772/79471421-9badb880-7fd0-11ea-9bf3-7e82bfabe4b6.png">


## Configure RDS
