# Self Signed TLS
    https://github.com/loganstellway/self-signed-ssl

Generate self-signed TLS certificate using OpenSSL

## Usage
>self-signed-tls [OPTIONS] -c=US --state=California

> mv srcmind.io.crt ../cert.crt
> mv srcmind.io.key ../cert.key

options should be all filled

## Options
  - **-c|--country**
    - Country Name (2 letter code)
  - **-s|--state**
    - State or Province Name (full name)
  - **-l|--locality**
    - Locality Name (eg, city)
  - **-o|--organization**
    - Organization Name (eg, company)
  - **-u|--unit**
    - Organizational Unit Name (eg, section)
  - **-n|--common-name**
    - Common Name (e.g. server FQDN or YOUR name)
  - **-e|--email**
    - Email Address
  - **-p|--path**
    - Path to output generated keys
  - **-h|--help**
    - Display help and exit
  - **-v|--verbose**
    - Verbose output


# GENERATE
  https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl
  https://stackoverflow.com/questions/21488845/how-can-i-generate-a-self-signed-certificate-with-subjectaltname-using-openssl
  https://serverfault.com/questions/845766/generating-a-self-signed-cert-with-openssl-that-works-in-chrome-58

# ADD TRUST
  https://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate  https://stackoverflow.com/a/46243968
  https://stackoverflow.com/questions/49553138/how-to-make-browser-trust-localhost-ssl-certificate  https://superuser.com/questions/437330/how-do-you-add-a-certificate-authority-ca-to-ubuntu
https://curl.haxx.se/docs/sslcerts.html
  https://stackoverflow.com/questions/50788043/how-to-trust-self-signed-localhost-certificates-on-linux-chrome-and-firefox
