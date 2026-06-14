# AWS Command Reference

## Environment Setup (CLI Installation)
- Update packages - sudo apt update
- Download AWS CLI installer - curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
- Install unzip - sudo apt install unzip -y
- Unzip installer - unzip awscliv2.zip
- Install AWS CLI - sudo ./aws/install
- Verify installation - aws --version

## Authentication
- Configure CLI with credentials - aws configure
- Verify connection/identity - aws sts get-caller-identity

## EC2 - Key Pair & Instance Creation
- Create SSH key pair - aws ec2 create-key-pair --key-name (your key name) --query 'KeyMaterial' --output text > (your key name).pem
- Restrict key file permissions - chmod 400 (your key name).pem
- Check free-tier eligible instance types - aws ec2 describe-instance-types --filters "Name=free-tier-eligible,Values=true" --query 'InstanceTypes[].InstanceType' --output text
- Find latest Ubuntu AMI - aws ec2 describe-images --owners amazon --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" "Name=state,Values=available" --query 'sort_by(Images, &CreationDate)[-1].ImageId' --output text
- Launch EC2 instance - aws ec2 run-instances --image-id (your AMI ID) --instance-type t3.micro --key-name (your key name) --count 1 --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=(your VM name)}]'
- Check instance status and public IP - aws ec2 describe-instances --filters "Name=tag:Name,Values=(your VM name)" --query 'Reservations[].Instances[].{State:State.Name,PublicIP:PublicIpAddress,InstanceId:InstanceId}' --output table

## Security Groups
- Check security group rules - aws ec2 describe-security-groups --group-ids (your security group id) --query 'SecurityGroups[0].IpPermissions'
- Allow SSH from anywhere - aws ec2 authorize-security-group-ingress --group-id (your security group id) --protocol tcp --port 22 --cidr 0.0.0.0/0

## Connecting and Managing the Instance
- SSH into instance - ssh -i (your key name).pem ubuntu@(your public IP)
- Stop instance - aws ec2 stop-instances --instance-ids (your instance id)
- Start instance - aws ec2 start-instances --instance-ids (your instance id)
- Terminate instance - aws ec2 terminate-instances --instance-ids (your instance id)
