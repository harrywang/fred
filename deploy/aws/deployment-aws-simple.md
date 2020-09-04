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
