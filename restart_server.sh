echo "Restarting Server"
killall unicorn && unicorn -c path/to/unicorn.rb -E development -D
echo "Done :)"