<?php

class PullController extends BaseController {
    public function __construct() {
        parent::__construct();
    }

    public function getIndex() {
        return View::make('pull.index');
    }
    
    public function getAll() {
        if (Request::ajax()){
            $pulls = Pull::all(array('lat','lng','content'));
            $bounds = Input::get('bounds');

            // findout all pull records between this bounds.

            $responseJson = array(
                'status' => 'OK',
                'message' => $bounds,
                'pulls' => $pulls->toArray()
            );
            return Response::json($responseJson);            
        }
    }

    public function postAdd(){
        if (Request::ajax()){
            $lat = Input::get('lat');
            $lng = Input::get('lng');
            $addr = Input::get('addr');
            $content = Input::get('content');
            
            $pull = new Pull;

            $pull->lat = $lat;
            $pull->lng = $lng;
            $pull->address = $addr;
            $pull->content = $content;
            $pull->save();

            $responseJson = array(
                'status'    => 'OK',
                'message'   => $lat.';'.$lng.';'.$addr.';'.$content,
            );

            return Response::json($responseJson);
        }
    }
}