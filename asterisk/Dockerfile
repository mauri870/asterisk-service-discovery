FROM dougbtv/asterisk14

COPY discovery /usr/bin/discovery
COPY entrypoint.sh /usr/bin/entrypoint

ENTRYPOINT [ "entrypoint", "asterisk", "-vvvdddf" ]
