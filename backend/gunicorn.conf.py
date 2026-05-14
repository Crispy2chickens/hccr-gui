workers = 1
timeout = 120

def post_fork(server, worker):
    import threading
    import app
    threading.Thread(target=app.preload, daemon=True).start()
