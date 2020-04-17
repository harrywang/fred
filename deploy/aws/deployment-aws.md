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

<img width="1273" alt="Screen Shot 2020-04-17 at 1 47 50 PM" src="https://user-images.githubusercontent.com/595772/79601176-654a6900-80b6-11ea-953e-680853c67ca9.png">
<img width="1277" alt="Screen Shot 2020-04-17 at 1 49 33 PM" src="https://user-images.githubusercontent.com/595772/79601186-6b404a00-80b6-11ea-9e5b-b9507ad5eadb.png">
<img width="1083" alt="Screen Shot 2020-04-17 at 1 52 06 PM" src="https://user-images.githubusercontent.com/595772/79601211-76937580-80b6-11ea-84fb-367f0c0de4ae.png">

Don't forget to change the value of REACT_APP_USERS_SERVICE_URL in buildspec.yml to the DNS name of the ALB.

Essentially, one ALB is created with one listener at port 80 and then have two rules to forward traffic:

- if path is /, forward to the frontend task group
- if other paths (/users /auth /etc.), forward to the backend task group at port 5000. NOTE only five paths can be specified in the rule.


## Configure RDS

<img width="820" alt="Screen Shot 2020-04-17 at 2 28 05 PM" src="https://user-images.githubusercontent.com/595772/79603125-bc9e0880-80b9-11ea-98b3-1acd51285cca.png">
<img width="842" alt="Screen Shot 2020-04-17 at 2 32 23 PM" src="https://user-images.githubusercontent.com/595772/79603136-c293e980-80b9-11ea-8caa-99aa5c3249a7.png">
<img width="808" alt="Screen Shot 2020-04-17 at 2 34 17 PM" src="https://user-images.githubusercontent.com/595772/79603151-ca538e00-80b9-11ea-9a1a-9c4983962a58.png">
<img width="805" alt="Screen Shot 2020-04-17 at 2 35 25 PM" src="https://user-images.githubusercontent.com/595772/79603162-cf184200-80b9-11ea-8402-b8ba3e648da8.png">

Get the password with master user name: fredapp:
<img width="1000" alt="Screen Shot 2020-04-17 at 2 41 15 PM" src="https://user-images.githubusercontent.com/595772/79603173-d3dcf600-80b9-11ea-85bf-5aefa652a46d.png">
<img width="597" alt="Screen Shot 2020-04-17 at 2 41 29 PM" src="https://user-images.githubusercontent.com/595772/79603176-d63f5000-80b9-11ea-85b7-9963ce8bbcca.png">


Get the status of database:
```
$ aws --region us-east-1 rds describe-db-instances \
  --db-instance-identifier fred-db \
  --query 'DBInstances[].{DBInstanceStatus:DBInstanceStatus}'

$ aws --region us-east-1 rds describe-db-instances \
  --db-instance-identifier fred-db
```

Run the following command to get the address of the database:
```
aws --region us-east-1 rds describe-db-instances \
  --db-instance-identifier fred-db \
  --query 'DBInstances[].{Address:Endpoint.Address}'

  [
    {
        "Address": "fred-db.coaqhaja4wc9.us-east-1.rds.amazonaws.com"
    }
]
```

So, the production URI is:
```
postgres://fredapp:<YOUR_PASSWORD>@<YOUR_ADDRESS>:5432/fred_prod
```

## Configure ECS



<img width="1241" alt="Screen Shot 2020-04-17 at 3 00 14 PM" src="https://user-images.githubusercontent.com/595772/79608518-2969d080-80c3-11ea-80ec-3317bce705fd.png">
<img width="858" alt="Screen Shot 2020-04-17 at 3 02 09 PM" src="https://user-images.githubusercontent.com/595772/79608540-325aa200-80c3-11ea-9750-0ef0c3c5058b.png">
<img width="824" alt="Screen Shot 2020-04-17 at 3 13 45 PM" src="https://user-images.githubusercontent.com/595772/79608569-41d9eb00-80c3-11ea-9800-53995955adf9.png">
<img width="827" alt="Screen Shot 2020-04-17 at 3 14 45 PM" src="https://user-images.githubusercontent.com/595772/79608582-469e9f00-80c3-11ea-8a0b-48b76f2dd2c1.png">
<img width="827" alt="Screen Shot 2020-04-17 at 3 12 34 PM" src="https://user-images.githubusercontent.com/595772/79608610-51593400-80c3-11ea-90e4-8248fdfc2d8c.png">  
<img width="825" alt="Screen Shot 2020-04-17 at 3 13 32 PM" src="https://user-images.githubusercontent.com/595772/79608619-54ecbb00-80c3-11ea-8b6d-a841b28b85a1.png">
<img width="796" alt="Screen Shot 2020-04-17 at 3 12 18 PM" src="https://user-images.githubusercontent.com/595772/79608673-68982180-80c3-11ea-9e1f-52e98d5759be.png">
<img width="1039" alt="Screen Shot 2020-04-17 at 3 18 42 PM" src="https://user-images.githubusercontent.com/595772/79608679-6d5cd580-80c3-11ea-84b2-04db6735e857.png">
<img width="849" alt="Screen Shot 2020-04-17 at 3 19 17 PM" src="https://user-images.githubusercontent.com/595772/79608694-7352b680-80c3-11ea-9095-0429a0f6b2bb.png">
<img width="840" alt="Screen Shot 2020-04-17 at 3 22 41 PM" src="https://user-images.githubusercontent.com/595772/79608713-7a79c480-80c3-11ea-9619-5acdedaddb0d.png">    
<img width="814" alt="Screen Shot 2020-04-17 at 3 22 30 PM" src="https://user-images.githubusercontent.com/595772/79608746-8796b380-80c3-11ea-8557-84156521538b.png">
<img width="861" alt="Screen Shot 2020-04-17 at 3 23 04 PM" src="https://user-images.githubusercontent.com/595772/79608754-8b2a3a80-80c3-11ea-96cc-136ed4d2d710.png">
<img width="1034" alt="Screen Shot 2020-04-17 at 3 23 51 PM" src="https://user-images.githubusercontent.com/595772/79608767-91b8b200-80c3-11ea-8dfb-ad9ac2de37bb.png">      
<img width="1041" alt="Screen Shot 2020-04-17 at 3 24 11 PM" src="https://user-images.githubusercontent.com/595772/79608781-98472980-80c3-11ea-96da-d8782f57a788.png">

<img width="892" alt="Screen Shot 2020-04-17 at 3 25 52 PM" src="https://user-images.githubusercontent.com/595772/79608808-a2692800-80c3-11ea-80b8-36051136c3e3.png">
<img width="894" alt="Screen Shot 2020-04-17 at 3 28 36 PM" src="https://user-images.githubusercontent.com/595772/79608815-a4cb8200-80c3-11ea-89af-e3fc2110dc6a.png">
<img width="888" alt="Screen Shot 2020-04-17 at 3 30 19 PM" src="https://user-images.githubusercontent.com/595772/79608825-a85f0900-80c3-11ea-884e-251ed7d2c6d8.png">
<img width="902" alt="Screen Shot 2020-04-17 at 3 31 27 PM" src="https://user-images.githubusercontent.com/595772/79608839-abf29000-80c3-11ea-85c9-1ebb11dc8efb.png">

<img width="886" alt="Screen Shot 2020-04-17 at 3 31 53 PM" src="https://user-images.githubusercontent.com/595772/79608853-af861700-80c3-11ea-942e-b94fa8712c3c.png">

<img width="910" alt="Screen Shot 2020-04-17 at 3 32 16 PM" src="https://user-images.githubusercontent.com/595772/79608879-b745bb80-80c3-11ea-8e8c-f6cb5811c3d0.png">
<img width="891" alt="Screen Shot 2020-04-17 at 3 34 57 PM" src="https://user-images.githubusercontent.com/595772/79608898-c2005080-80c3-11ea-84b3-a1f48ba0f8ee.png">

update security group rule to make healthy check pass:

<img width="1048" alt="Screen Shot 2020-04-17 at 3 56 14 PM" src="https://user-images.githubusercontent.com/595772/79609071-173c6200-80c4-11ea-83af-6060ebb2279e.png">
<img width="1003" alt="Screen Shot 2020-04-17 at 3 56 31 PM" src="https://user-images.githubusercontent.com/595772/79609117-2b805f00-80c4-11ea-9fac-1fcb6cc488ad.png">


- Task Definition:
- Tasks
- Services
- Clusters

Cluster has services, service has tasks


get the EC2 instance of the backend to login to initialize the database:

<img width="611" alt="Screen Shot 2020-04-17 at 3 58 18 PM" src="https://user-images.githubusercontent.com/595772/79609348-96319a80-80c4-11ea-8867-39d56b7da12a.png">
<img width="540" alt="Screen Shot 2020-04-17 at 3 58 27 PM" src="https://user-images.githubusercontent.com/595772/79609355-97fb5e00-80c4-11ea-8431-9ea3457dc653.png">
<img width="515" alt="Screen Shot 2020-04-17 at 3 58 43 PM" src="https://user-images.githubusercontent.com/595772/79609362-9a5db800-80c4-11ea-98ab-442e60978953.png">
<img width="636" alt="Screen Shot 2020-04-17 at 3 58 50 PM" src="https://user-images.githubusercontent.com/595772/79609370-9cc01200-80c4-11ea-87bd-6949e0e93555.png">
<img width="932" alt="Screen Shot 2020-04-17 at 3 59 05 PM" src="https://user-images.githubusercontent.com/595772/79609373-9e89d580-80c4-11ea-85a6-cacfc986c675.png">


```
dami:fred harrywang$ chmod 400 ~/sandbox/keys/fred-aws.pem
dami:fred harrywang$ ssh -i ~/sandbox/keys/fred-aws.pem ec2-user@52.70.49.60
```


```
[ec2-user@ip-172-31-84-8 ~]$ docker ps
CONTAINER ID        IMAGE                                                            COMMAND                  CREATED             STATUS                    PORTS                     NAMES
017ff3d54c29        991046682610.dkr.ecr.us-east-1.amazonaws.com/fred-backend:prod   "/bin/sh -c 'gunicor…"   4 minutes ago       Up 4 minutes              0.0.0.0:32770->5000/tcp   ecs-fred-backend-td-1-backend-e09bb2fc80e288904f00
de0d72895173        amazon/amazon-ecs-agent:latest                                   "/agent"                 22 minutes ago      Up 22 minutes (healthy)                             ecs-agent
```

```
$ docker exec -it 017ff3d54c29 bash
root@017ff3d54c29:/usr/src/app# python manage.py reset_db
database reset done!
root@017ff3d54c29:/usr/src/app# python manage.py load_data
user table loaded
author and quote tables loaded
```

Now go to http://LOAD_BALANCER_DNS_NAME to test out!!


## Configure CodeBuild

add the following files:

- ecs/ecs_backend_task_definition.json
- ecs/ecs_frontend_task_definition.json
- deploy.sh

update `buildspec.yml`:

```
post_build:
  commands:
  - echo pushing prod images to ecr...
  - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/fred-backend:prod
  - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/fred-frontend:prod
  - chmod +x ./deploy.sh
  - bash deploy.sh
```

Then, go to CodeBuild to add more environment variables:

<img width="1225" alt="Screen Shot 2020-04-17 at 4 11 48 PM" src="https://user-images.githubusercontent.com/595772/79611214-19082480-80c8-11ea-88f3-e8428f39408d.png">
<img width="733" alt="Screen Shot 2020-04-17 at 4 12 56 PM" src="https://user-images.githubusercontent.com/595772/79611337-5e2c5680-80c8-11ea-9c53-7c50763350b3.png">


Then, add a security policy to the role:
<img width="981" alt="Screen Shot 2020-04-17 at 4 15 02 PM" src="https://user-images.githubusercontent.com/595772/79611250-2b825e00-80c8-11ea-8c72-c061de68f2cc.png">

## Shutdown

4 EC2 instances were started - you may want to shutdown them to avoid charges.

Delete the clusters will terminate all related EC2 instances. 
