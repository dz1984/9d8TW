<?php
use Repository\IPullRepository;

class PullController extends BaseController {
    private $pullRepository;

    public function __construct(IPullRepository $pullRepository)
    {
        parent::__construct();
        $this->pullRepository = $pullRepository;
    }

    public function getIndex()
    {
        $this->view('pull.index');
    }

    public function getAll()
    {
        $status = 'FAIL';
        $message = '';
        $pulls = array();

        if (Request::ajax())
        {

            $bounds = Input::get('bounds');

            // findout all pull records between this bounds.
            $pulls = $this->pullRepository
                          ->findAllByBounds($bounds)
                          ->toArray();

            $status = 'OK';

        }

        return $this->json(compact('status', 'message', 'pulls'));
    }

    public function getAdd()
    {
        $status = 'FAIL';
        $message = '';
        $pull = array();

        if (Request::ajax())
        {
            $id = Input::get('id');
            $lat = Input::get('lat');
            $lng = Input::get('lng');
            $addr = Input::get('addr');
            $content = Input::get('content');

            if (null == $id)
            {
                $pull = $this->pullRepository
                             ->addPull(compact('lat', 'lng', 'addr'));

                $id = $pull->id;
            }

            $this->pullRepository
                 ->addConfide($id, $content);

            $pull = $this->pullRepository
                         ->findById($id)
                         ->toArray();

            $status = 'OK';
        }

        return $this->json(compact('status', 'message', 'pull'));
    }
}