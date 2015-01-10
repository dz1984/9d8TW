<?php
use Repository\IPullRepository;

class PullController extends BaseController {
    private $pull;

    public function __construct(IPullRepository $pull) {
        parent::__construct();
        $this->pull = $pull;
    }

    public function getIndex() {
        $this->view('pull.index');
    }
    
    public function getAll() {
        $status = 'FAIL';
        $message = '';
        $pull  = array();

        if (Request::ajax()){
        
            $bounds = Input::get('bounds');

            // findout all pull records between this bounds.
            $pulls = $this->pull->findAllByBounds($bounds)
                                ->toArray();

            $status = 'OK';
                        
        }
        
        return $this->json(compact('status', 'message', 'pulls'));
    }

    public function getAdd(){
        $status = 'FAIL';
        $message = '';
        $pull  = array();

        if (Request::ajax()){
            $id = Input::get('id');
            $lat = Input::get('lat');
            $lng = Input::get('lng');
            $addr = Input::get('addr');
            $content = Input::get('content');
  
            if (null == $id) {
                $pull = $this->pull->addPull(compact('lat', 'lng', 'addr'));

                $id = $pull->id;
            } 
            
            $this->pull->addConfide($id, $content);
     
            $pull = $this->pull->findById($id)
                                ->toArray();

            $status = 'OK';
        }

        return $this->json(compact('status', 'message', 'pull'));
    }
}