# Simple AWS Deployment

Test out the production images locally:

```
$ docker-compose down -v
$ docker-compose -f docker-compose.prod.yml up -d --build
$ docker-compose exec backend python manage.py reset_db
$ docker-compose exec backend python manage.py load_data
```

Test it out at http://localhost:3007/ and http://localhost:5001/docs

Go to Amazon ECS, click "Repositories", and then add one new repository:
- fred: `aws ecr create-repository --repository-name fred --region us-east-1`
- get <AWS_ACCOUNT_ID> and <ECR-fred-repo-URI>: `aws ecr describe-repositories --repository-name fred`

Then

Build single production image with the `prod` tag:

```
docker build -f deploy/aws/Dockerfile-aws.deploy -t <ECR-fred-repo-URI>:prod .
```
Given that RDS database is in VPN and cannot be accessed directly from the Internet. We will use the local Postgres to test.

Make the the testing images are still running. Export local environment variable DATABASE_URL using RDS production database URL:
```
$ export DATABASE_URL=postgres://postgres:postgres@localhost:5432/app_prod
```

- Start the newly built image (the default Nginx port is 80):
`docker run -d --name fred-aws -e DATABASE_URL="$(echo $DATABASE_URL)" -e "SECRET_KEY=test" -p 8007:80 <ECR-fred-repo-URI>:prod`

Test it out at http://localhost:8007 and http://localhost:5001/docs

```
$ docker stop fred-aws
$ docker rm fred-aws
```

Push prod image to ECR:

```
aws ecr get-login-password --region us-east-1 \
      | docker login --username AWS --password-stdin \
      <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/fred:prod
```


## Configure CodeBuild

Go to the CodeBuild dashboard and click "Create project":

specify `buildspec-simple.yml`, push the code to Github and build in CodeBuild. Make sure it succeeds.


## Configure RDS

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

### Task Definition

Firstly, you should create task definition in ECS.

- Create the task definition and choose `EC2`.

![image](https://user-images.githubusercontent.com/24386525/97777465-4f604980-1bab-11eb-8773-04992051ce9e.png)
![image](https://user-images.githubusercontent.com/24386525/97777472-5c7d3880-1bab-11eb-8f31-aa9714bc10ac.png)


- Then click `Add container`. And there shoulbe be a new window.  

![image](https://user-images.githubusercontent.com/24386525/97777511-b978ee80-1bab-11eb-9c4c-eb43a41da435.png)
![image](https://user-images.githubusercontent.com/24386525/97777530-d7deea00-1bab-11eb-84e2-fc23a73c22da.png)

- Add Standard information.  

![image](https://user-images.githubusercontent.com/24386525/97777558-0fe62d00-1bac-11eb-8610-59c3031be7da.png)

- Add environment variable. You need to scroll down to find it.  

![image](https://user-images.githubusercontent.com/24386525/97777645-9a2e9100-1bac-11eb-81ef-1c65543fdc33.png)

- Click `Add`, and the window will be closed and you can see the container you just add.  

![image](https://user-images.githubusercontent.com/24386525/97777679-c9dd9900-1bac-11eb-91ca-25f3d394e055.png)

- Scroll to the bottom and click `Create`, now you can see your task definition.

### Create Cluster  

Also in the ECS, you can create a cluster.

- Click `Create Cluster`, and choose `EC2 Linux + Networking`  

![image](https://user-images.githubusercontent.com/24386525/97777812-9bac8900-1bad-11eb-8b64-e3f4c40dd626.png)

- Give your cluster a name, choose EC2 type as `t3.nano`, set number of instances to `2`, and remember to choose `Key pair` because we need to ssh to our instance.  

![image](https://user-images.githubusercontent.com/24386525/97777888-1a092b00-1bae-11eb-869f-8cc84a1223b5.png)

- In networking part, use VPC and all subnets we created. And choose security group we created.  

![image](https://user-images.githubusercontent.com/24386525/97777935-753b1d80-1bae-11eb-9ff4-9bc5a4c78cef.png)

- Click `Create` and wait a minute.  

### Create Service in Cluster  

Now we need to use the task definition to create service in the cluster.  

- There should be a `View Cluster` button after the cluster created. Click it and you can see the status of the cluster.
- Now you can click `Create` in the `Services` tab to create service.  

![image](https://user-images.githubusercontent.com/24386525/97778001-fb576400-1bae-11eb-8d30-c45b3c1cc9cc.png)

- Follow the configuration in the image. `Launch type`, `Task Definition`, `Service name`, and `Number of tasks` are configured.  

![image](https://user-images.githubusercontent.com/24386525/97778010-10cc8e00-1baf-11eb-8cb6-63cd57132a40.png)

- No need to change other configurations. Just make sure the `Placement Templates` is `AZ Balanced Spread`.  

![image](https://user-images.githubusercontent.com/24386525/97778058-88022200-1baf-11eb-8610-4d1d3d7fd3c8.png)

- Next, configure the Load balancer. Choose `Application Load Balancer` and correct `IAM role`.  

![image](https://user-images.githubusercontent.com/24386525/97778141-0f4f9580-1bb0-11eb-969f-81af4be646a3.png)

- Click `Add to load balancer`, and configure as you need. The `Production listener port` is the port of your load balancer, when you visit %URL_OF_YOUR_LOAD_BALANCER:PORT, the request will be forwarded to `fred:80`.  

![image](https://user-images.githubusercontent.com/24386525/97778226-c3512080-1bb0-11eb-9cbb-52308b23d265.png)

- Click `Next step`, and you can set auto scaling.  
- `Next step` again, and you can review your configuration. Click `Create Service` if everything looks fine.  
- Now your service is created.  

## Initialize Database

SSH to the running instance to run init command.  

- Click `View Service` after you finish last step.  
- Wait a minute and you can see the status of your task in service is `RUNNING`.  

![image](https://user-images.githubusercontent.com/24386525/97778386-c8629f80-1bb1-11eb-8633-ce8364a88bad.png)

- Click task id (the first column), and there should be `EC2 instance id` in task detail.  

![image](https://user-images.githubusercontent.com/24386525/97778423-06f85a00-1bb2-11eb-9eb1-95f4dc687c66.png)

- Click `EC2 instance id` and you will be redirect to EC2 dashboard, now you can get the ip address of running instance.

![image](https://user-images.githubusercontent.com/24386525/97778459-46bf4180-1bb2-11eb-89e6-1a0013488bae.png)

- SSH to this instance.  

```shell
ssh -i %YOUR_PEM_FILE ec2-user@%INSTANCE_IP
```

- Run `docker ps` to make sure container is running.  

```shell
[ec2-user@ip-172-31-84-8 ~]$ docker ps
CONTAINER ID        IMAGE                                                            COMMAND                  CREATED             STATUS                    PORTS                     NAMES
017ff3d54c29        991046682610.dkr.ecr.us-east-1.amazonaws.com/fred-backend:prod   "/bin/sh -c 'gunicor…"   4 minutes ago       Up 4 minutes              0.0.0.0:32770->5000/tcp   ecs-fred-backend-td-1-backend-e09bb2fc80e288904f00
de0d72895173        amazon/amazon-ecs-agent:latest                                   "/agent"                 22 minutes ago      Up 22 minutes (healthy)                             ecs-agent
```

- Follow the instructions below to initialize database.  

```shell
$ docker exec -it 017ff3d54c29 sh # we use alpine as our base image, so /bin/bash cannot open shell of the container, use `sh` instead
root@017ff3d54c29:/usr/src/app# python manage.py reset_db
database reset done!
root@017ff3d54c29:/usr/src/app# python manage.py load_data
user table loaded
author and quote tables loaded
```

Now go to http://LOAD_BALANCER_DNS_NAME:PORT to test out!!
