# nginx反向代理与负载均衡

## 反向代理

通过第三方服务器访问服务器集群的内容，但是我们并不知道是那一台服务器提供的内容，此种代理的方式称为 *反向代理*

```nginx
server {
    Listen 80;
    server_name:xxxx //指定域名
    Location / {
        Proxy_pass http://10.10.10.10:20186 //开发机地址
    }
}
```

## 负载均衡

nginx会给你分配服务器压力小的去访问

```nginx
worker_processes 1; //工作进程数，和CPU核数相同
events {
    worker_connections 1024;//每个进程允许的最大连接数
}
http {
    upstream firstdemo { //负载均衡服务器
        ip_hash；//如果第一次访问给服务器就记录，之后再访问都是该服务器了
        server 39.106.145.33;
        server 47.93.6.93;
    }
    server {//反向代理
        listen 8080;
        location / {
            proxy_pass http://firstdemo //代理到firstdemo里的两个服务器
        }
    }
}
```