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

## Cross-Region Troubleshooting (Day 2)
- Check current CLI default region - aws configure get region
- Set CLI default region - aws configure set region (region name)
- List key pairs in a specific region - aws ec2 describe-key-pairs --region (region name)
- List all instances with name, ID, state, IP, key - aws ec2 describe-instances --region (region name) --query 'Reservations[].Instances[].{Name:Tags[?Key==`Name`]|[0].Value,InstanceId:InstanceId,State:State.Name,PublicIP:PublicIpAddress,KeyName:KeyName}' --output table
- Search entire filesystem for a file by name - find / -iname "*filename*" 2>/dev/null
- Check a key pair's fingerprint on AWS - aws ec2 describe-key-pairs --key-names (key name) --region (region name)
- Check a local .pem file's fingerprint - openssl pkey -in (keyfile.pem) -pubout -outform DER 2>/dev/null | openssl md5 -c

## Starting a Stopped Instance
- Start a stopped instance - aws ec2 start-instances --region (region name) --instance-ids (instance id)
- Get the new public IP after starting - aws ec2 describe-instances --region (region name) --instance-ids (instance id) --query 'Reservations[].Instances[].PublicIpAddress' --output text

## Elastic IP (Static Public IP)
- Allocate a new Elastic IP - aws ec2 allocate-address --region (region name) --domain vpc
- Attach Elastic IP to an instance - aws ec2 associate-address --region (region name) --instance-id (instance id) --allocation-id (allocation id)
- Release an Elastic IP (stop being billed for it) - aws ec2 release-address --region (region name) --allocation-id (allocation id)

## File Permissions Fix (Windows-mounted drives in WSL)
- Copy a file from Windows drive into Linux home directory - cp "/mnt/c/path/to/file.pem" ~/newname.pem
- Fix private key permissions (only works properly inside Linux home, not /mnt/c) - chmod 400 ~/newname.pem

## Linux File Permissions (chmod & chown)
- Create a file with content - echo "your text" > filename.txt
- View file permissions - ls -la
- Change file permissions (numeric) - chmod (number) filename
- Give owner full access only - chmod 700 filename
- Give owner read/write only - chmod 600 filename
- Give owner read only - chmod 400 filename
- Change file ownership - sudo chown user:group filename
- Change ownership recursively - sudo chown -R user:group /path/to/folder

## User Management
- Create a new user - sudo adduser username
- Switch to another user - su - username
- Exit back to previous user - exit
- Check current user's groups - groups
- View all users on system - cat /etc/passwd | grep -v nologin | grep -v false
- View sudoers file - sudo cat /etc/sudoers

## Security Logs
- View all auth logs - sudo cat /var/log/auth.log
- Filter auth logs by username - sudo cat /var/log/auth.log | grep username
