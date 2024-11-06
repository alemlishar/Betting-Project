FROM falconediego/ntg:latest

COPY start.sh /home/
COPY settings.xml /home/

ENV mockDevice=1
ENV virtual-silicon-number='PUT_YOUR_SILICON_NUMBER_HERE'

ENTRYPOINT ["/home/start.sh"]

# docker build --pull --rm -t ntg-local-be:latest .
# docker volume create --name ntg-local-be
# docker run --rm -it -p 8080:8080/tcp -v ntg-local-be:/home/volume ntg-local-be:latest
