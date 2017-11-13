### Asterisk Service Discovery with Etcd

```bash
asterisk - Simple asterisk images
etcd-node - Simple node app to retrieve the nodes from etcd
k8s - Kubernetes config files
```

> A more concrete node example can be found [here](https://github.com/dougbtv/vnf-asterisk-controller)

### Docker compose

```bash
docker-compose up -d
docker-compose exec etcd-node node index # open in a new tab
# You should see one asterisk in the app logs.
# If you bring the asterisk server down you will see that the server is also deleted from the app(and etcd too).
docker-compose stop asterisk
```

### Kubernetes

The kubernetes example is more interesting because we can see how the proccess of scaling and destroying pods happens and how the pods communicate with etcd.

> You need to install `kubectl` and `minikube` 

```bash
docker build -f asterisk/Dockerfile.alpine -t asterisk-discovery ./asterisk
docker build -f etcd-node/Dockerfile -t node-discovery ./etcd-node
```

Now we need to transfer our local images to the minikube VM. This can take a while.

```bash
minikube start 
for image in asterisk node
do
    docker save $image-discovery | ssh -o UserKnownHostsFile=/dev/null \
        -o StrictHostKeyChecking=no -o LogLevel=quiet \
        -i ~/.minikube/machines/minikube/id_rsa docker@$(minikube ip) docker load
done
```

```bash
kubectl create -f k8s
kubectl get pods # get the respective pod name
kubectl logs -f node-[pod id] # wait until nodes are displayed on logs
kubectl scale rc asterisk --replicas=4 # you should see a new server on the node logs after some time
kubectl scale rc asterisk --replicas=2
kubectl delete -f k8s
```
