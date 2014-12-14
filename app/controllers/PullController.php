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
            

            $bounds = Input::get('bounds');

            // findout all pull records between this bounds.
            list($lat_lo,$lng_lo,$lat_hi,$lng_hi) = explode(',',$bounds);
            $pulls = Pull::with('confides')
                ->whereBetween('lat', array($lat_lo, $lat_hi))
                ->whereBetween('lng', array($lng_lo, $lng_hi))
                ->get(array('id','lat','lng','address'));

            $responseJson = array(
                'status' => 'OK',
                'message' => '',
                'pulls' => $pulls->toArray()
            );
            return Response::json($responseJson);            
        }
    }

    public function getAdd(){
        if (Request::ajax()){
            $id = Input::get('id');
            $lat = Input::get('lat');
            $lng = Input::get('lng');
            $addr = Input::get('addr');
            $content = Input::get('content');
  
            if (null == $id) {
                $pull = new Pull;
                $pull->lat = $lat;
                $pull->lng = $lng;
                $pull->address = $addr;
                $pull->save();

                $id = $pull->id;

            } else {
                $pull = Pull::find($id);
            }

            $confide = new Confide;
            $confide->pull_id = $pull->id;
            $confide->content = $content;
            $confide->save();

            $pull = Pull::find($id, array('id'));
            $pull->load('confides');

            $responseJson = array(
                'status'    => 'OK',
                'message'   => '',
                'pull'  => $pull->toArray()
            );

            return Response::json($responseJson);
        }
    }
}