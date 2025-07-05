you can access the pront end from http://IP:3000


To add product : http://IP:3000/add-product

beore running application:

1. Need to update the api url's (In frontend)
2. Update the aws keys in docker file
3. Run the sql scripts for DB creations if required
4. Updates the DB connection string IF required


To allow in Windows Firewall:
New-NetFirewallRule -DisplayName "Allow Port 5000" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow

Administrator
CZqV@R7!Fj@Ih.M@vW=HMiB-Q0c.!L!D