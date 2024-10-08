
# EdgeRouter

## Initial Set Up

1. Connect an Ethernet cable from a computer to the eth0 interface on the EdgeRouter.
2. Configure a static IP address on your computer in the 192.168.1.0/24 range (for example 192.168.1.11).
    ```bash
    sudo ip addr add 192.168.1.11/24 dev eth0
    sudo ip link set eth0 up
    ```
3. Connect using the username `ubnt` and the password `ubnt`.
    ```bash
    ssh ubnt@192.168.1.1
    ```
4. Create a new user
    ```bash
    configure

    set system login user kszakharov full-name "Kostiantyn Zakharov"
    set system login user kszakharov level admin

    # encrypt the password
    openssl passwd -5 "<password>"

    set system login user kszakharov authentication encrypted-password <encrypted-password>
    set system login user kszakharov authentication public-keys ssh-key type ssh-rsa
    set system login user kszakharov authentication public-keys ssh-key key <public-key>

    commit
    save
    exit
    ```
5. Reconnect using the new user
    ```bash
    ssh 192.168.1.1
    ```
6. Disable password authentication for SSH
    ```bash
    configure

    set service ssh disable-password-authentication

    commit
    save
    exit
    ```
7. Remove the default user
    ```bash
    configure

    delete system login user ubnt

    commit
    save
    exit
    ```

## Configuration

To configure the device, enter configuration mode and run the following commands. Each command should be executed between the `configure`, `commit`, `save`, and `exit` commands.

```bash
configure
<command>
commit
save
exit
```

1. Set the Hostname
    ```bash
    set system host-name <host-name>
    ```
2. Set the Timezone
    ```bash
    set system time-zone America/Toronto
    ```
3. Base network configuration
    ```bash
    # WAN interface
    set interfaces ethernet eth0 address dhcp

    # LAN interface
    set interfaces ethernet eth1 address 10.0.1.1/24
    set protocols static route 10.0.0.0/24 next-hop 10.0.1.2
    set service dhcp-server shared-network-name DHCP authoritative disable
    set service dhcp-server shared-network-name DHCP subnet 10.0.1.0/24 dns-server 10.0.0.53
    set service dhcp-server shared-network-name DHCP subnet 10.0.1.0/24 dns-server 8.8.8.8
    set service dhcp-server shared-network-name DHCP subnet 10.0.1.0/24 lease 86400
    set service dhcp-server shared-network-name DHCP subnet 10.0.1.0/24 start 10.0.1.2 stop 10.0.1.10

    # MGMT interface
    set interfaces ethernet eth4 address 192.168.1.1/24
    ```
4. Connect `eth`0 to the Internet and `eth1` to the downstream router's WAN interface
5. Reconnect using the new address
    ```bash
    ssh 10.0.1.1
    ```
6. Configure services to listen only on local interfaces
    ```bash
    set service gui listen-address 10.0.1.1
    set service gui listen-address 192.168.1.1
    set service ssh listen-address 10.0.1.1
    set service ssh listen-address 192.168.1.1
    ```
7. Configure NAT masquerading
    ```bash
    set service nat rule 5001 description NAT
    set service nat rule 5001 log disable
    set service nat rule 5001 outbound-interface eth0
    set service nat rule 5001 protocol all
    set service nat rule 5001 source group
    set service nat rule 5001 type masquerade
    ```

## WireGuard Setup

1. Download and install WireGuard
    ```bash
    curl -qLs https://github.com/WireGuard/wireguard-vyatta-ubnt/releases/download/1.0.20220627-1/e50-v2-v1.0.20220627-v1.0.20210914.deb -o wireguard.deb
    sudo dpkg -i wireguard.deb
    ```
2. Generate WireGuard Keypair
    ```bash
    wg genkey | tee /dev/tty | wg pubkey
    ```
3.  Configure WireGuard Interface
    ```bash
    configure
    set interfaces wireguard wg0 address 10.10.0.1/24
    set interfaces wireguard wg0 listen-port 51820
    set interfaces wireguard wg0 route-allowed-ips true
    set interfaces wireguard wg0 private-key <server_pivate_key>
    set interfaces wireguard wg0 peer <client_public_key> allowed-ips 10.10.0.0/24
    commit
    save
    ```
