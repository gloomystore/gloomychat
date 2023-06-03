const conn = peer.connect('client2')
peer.on('connection', ()=>{
  console.log('다른 클라이언트가 접속했습니다.')
});