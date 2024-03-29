@dir = "/home/deploy/webapp"

worker_processes 2
working_directory @dir

timeout 30

listen File.join(@dir,"tmp/sockets/unicorn.sock"), :backlog => 64

pid File.join(@dir,"tmp/pids/unicorn.pid")

stderr_path File.join(@dir,"log/unicorn.stderr.log")
stdout_path File.join(@dir,"log/unicorn.stdout.log")



